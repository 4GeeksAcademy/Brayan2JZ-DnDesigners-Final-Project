"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from api.utils import APIException, generate_sitemap
from api.models import db, ThreeDBank
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from datetime import timedelta, datetime

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.dirname(
    os.path.realpath(__file__))), 'public')  # Adjusted to work relative to src/
app = Flask(__name__)
app.url_map.strict_slashes = False

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Add the admin
setup_admin(app)

# Add commands
setup_commands(app)

# Add all endpoints from the API with an "api" prefix
app.register_blueprint(api, url_prefix='/api')

app.config["JWT_SECRET_KEY"] = 'its-a-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
jwt = JWTManager(app)

# Maximum upload size: 100 MB
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

# Absolute path for uploads
UPLOAD_FOLDER = '/workspaces/Brayan2JZ-DnDesigners-Final-Project/static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure upload directory exists

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.errorhandler(RequestEntityTooLarge)
def handle_large_file_error(e):
    return jsonify({"error": "File is too large. Maximum upload size is 100 MB."}), 413

# Generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Avoid cache memory
    return response

# Endpoint to get all 3D models
@app.route('/api/models', methods=['GET'])
def get_all_models():
    models = ThreeDBank.query.all()
    return jsonify([model.serialize() for model in models]), 200

# Endpoint to upload a chunk of a 3D model
@app.route('/api/models/upload-chunk', methods=['POST'])
def upload_chunk():
    # Check if a chunk is provided
    chunk = request.files.get('chunk')
    if not chunk:
        return jsonify({"error": "No chunk received"}), 400
    print(request.form.get('description'), "request form!!!!!")
    # Retrieve metadata
    filename = secure_filename(request.form.get('title', 'uploaded_file'))
    chunk_index = int(request.form.get('chunkIndex', 0))
    total_chunks = int(request.form.get('totalChunks', 1))
    print(chunk.read(), "chunk read")

    # Temporary file path for chunked upload
    temp_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}.tmp")

    # Append the chunk to the temporary file
    with open(temp_file_path, 'ab') as f:
        f.write(chunk.read())

    # Check if this is the last chunk
    if chunk_index == total_chunks - 1:
        final_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.rename(temp_file_path, final_file_path)

        # Save metadata to the database
        new_model = ThreeDBank(
            filename=filename,
            url=f"/uploads/{filename}",  # Save relative URL for serving
            description=request.form.get('description'),
            uploadedDate=datetime.utcnow(),
            userId=request.form.get('userId')
        )
        db.session.add(new_model)
        db.session.commit()

        return jsonify({"message": "Upload completed", "url": f"/uploads/{filename}"}), 200

    return jsonify({"message": "Chunk received"}), 200

# Endpoint to delete a 3D model
@app.route('/api/models/<int:model_id>', methods=['DELETE'])
def delete_model(model_id):
    model = ThreeDBank.query.get(model_id)
    if not model:
        return jsonify({"error": "Model not found"}), 404

    # Delete the file from the filesystem
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], model.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(model)
    db.session.commit()

    return jsonify({"message": "Model deleted successfully"}), 200

# This only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
