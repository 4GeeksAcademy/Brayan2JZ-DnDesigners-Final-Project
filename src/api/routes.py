"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User,CardBank,TagList,Favorites,ArtBank,Settings
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from imagekitio import ImageKit
import base64


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

imagekit = ImageKit(
    private_key='private_MF5Uvl5skn9/uiH60hysYAy/bZ4=',
    public_key='public_MOLUGMGh1B5n6dSKNx84+WdQIKc=',
    url_endpoint = 'https://ik.imagekit.io/fv8g33qor/'
)

@api.route('/hello', methods=['POST', 'GET'])
@jwt_required()
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

### FAVORITES
@api.route('/favorite/<int:userId>/<int:imageId>',methods=['GET'])
@jwt_required()
def getFavorite(userId,imageId):
    print("Before query")
    userFavorite=Favorites.query.filter_by(userId=userId, imageID=imageId).first()
    print(userFavorite)
    if userFavorite is not None:
        return jsonify({'status':'Found'})
    else:
        return jsonify({'status':'Not found'})
    S
@api.route('/favorite',methods=['POST'])
@jwt_required()
def favorite():      #Need image ID and user ID
    print('in post')
    imageId=request.json['imageId']
    userId=request.json['userId']

    newFavorite=Favorites(imageID=imageId,userId=userId)
    db.session.add(newFavorite)
    db.session.commit()
    favId=Favorites.query.filter_by(imageID=imageId,userId=userId).first().serialize()
    return jsonify({'id':favId['id']})


@api.route('/favorite',methods=['DELETE'])
@jwt_required()
def deleteFavorite():      #Need image ID and user ID
    imageId=request.json['imageId']
    userId=request.json['userId']

    if imageId and userId:
        newFavorite=Favorites.query.filter_by(imageID=imageId,userId=userId).first()
        db.session.delete(newFavorite)
        db.session.commit()
        return jsonify({'status':'False'})
    
@api.route('/favorites',methods=['GET'])
@jwt_required()
def getFavorites():
    userId=request.json['id']
    userFavorites=Favorites.query.filter_by(userId=userId).all()
    userFavorites=list(map(lambda x: x.serialize().get('imageID'),userFavorites))
    userCards = CardBank.query.filter(CardBank.id.in_(userFavorites)).all()
    userCards=list(map(lambda x: x.serialize(),userCards))
    return jsonify(userCards)

### CARD STUFF
@api.route('/card',methods=['POST'])
@jwt_required()
def addCard(): #library to upload pictures
    print("before picture upload")
    print(request.json['uri'])
    print(request.json['filename'])
    upload = imagekit.upload_file(  
        file=request.json['uri'],
        file_name=request.json['filename'],
    )
    print("uploaded new card")
    newCard= CardBank(
        userId=request.json['userId'],
        filename=request.json['filename'],
        url= upload.response_metadata.raw['url'],
        tags=",".join(request.json['tags']),
        uploadedDate=request.json['uploadedDate']

        )
    print(newCard)
    db.session.add(newCard)
    db.session.commit()

    for tag in request.json['tags']:
        tagMatch=TagList.query.filter_by(tagDescription=tag).first()
        if tagMatch:
            tagMatch.tagCount=tagMatch.tagCount+1
            db.session.commit()
        else:
            newTag=TagList(tagDescription=tag,tagCount=1)
            db.session.add(newTag)
            db.session.commit()

    cardId=CardBank.query.filter_by(filename=request.json['filename']).first().id
    print(cardId)
    return jsonify({'id':cardId,'url': upload.response_metadata.raw['url']})

@api.route('/cardid',methods=['POST'])
def getCard():      #Need only image ID
    imageMatch=CardBank(id=request.json['imageId'])

    if imageMatch:
        return jsonify({'url':imageMatch.url, 'filename':imageMatch.filename,'tags':imageMatch.tags})

@api.route('/cards',methods=['GET'])
def getCards():
    cards=CardBank.query.all()

    cardsList=list(map(lambda x: x.serialize(),cards))
    return cardsList

@api.route('/usercards',methods=['GET'])
@jwt_required()
def userGallery():      #Need user ID
    userCards=CardBank.query.filter_by(userId=request.json['userId'])

    serializedCards=list(map(lambda x: x.serialize(),userCards))

    return jsonify(serializedCards)

### TAG STUFF
@api.route('/cardbytag',methods=['POST'])
def getByTag():
    tag=request.json['tag']
    cardList=[]
    cards=CardBank.query.all()
    cards=list(map(lambda x: x.serialize(),cards))
    for card in cards:
        if tag in card.get('tags'):
            cardList.append(card)
    # print(cardList)
    return jsonify(cardList)

@api.route('/tags',methods=['GET'])
def allTags():
    tags=TagList.query.all();
    tags=list(map(lambda x: x.serialize(),tags))
    return jsonify({'tags':tags})

#### USER STUFF
@api.route('/token',methods=['POST'])
def login():
    username=request.json['username']
    password=request.json['password']
    
    user=User.query.filter_by(username=username,password=password).first()
    print(user)
    if(user is not None):
        token=create_access_token(identity=user.id)
        return jsonify({'token':token,'id':user.id})
    else:
        return "Wrong username or password"
    
@api.route('/register',methods=['POST'])
def register():
    inputuser=request.json['username']
    inputpass=request.json['password']

    isUser=User.query.filter_by(username=inputuser)

    if isUser:        
        newUser=User(username=inputuser,password=inputpass)
        db.session.add(newUser)
        db.session.commit()
        print("Success")
        return jsonify("User created successfuly. Hello %s",inputuser)
    else:
        return jsonify("User already exists")

@api.route('/users',methods=['GET'])
@jwt_required()
def getAllUsers():
    users=User.query.all()
    print(users)

    userList=list(map(lambda x: x.serialize(),users))
    print(userList)
    return userList

# @api.route('/islogin',methods=['GET'])
# @jwt_required()
# def isLoggedIn():

### ART STUFF
@api.route('/upload-art',methods=['POST'])
@jwt_required()
def addArt():
    file = request.files['file']
    title = request.form.get('title')
    caption = request.form.get('caption')

    if file:
        # Convert the file to Base64
        file_content = file.read()
        base64_encoded_image = base64.b64encode(file_content).decode('utf-8')
        data_url = f"data:{file.content_type};base64,{base64_encoded_image}"

    upload = imagekit.upload_file(  
        file=data_url,
        file_name=title,
    )
    url= upload.response_metadata.raw['url']
    newArt=ArtBank(imageUrl=url, fileName=title, caption=caption)

    db.session.add(newArt)
    db.session.commit()

    art=ArtBank.query.filter_by(fileName=title).first().serialize()
    return jsonify({
        'id':art.get('id'),
        'fileName':art.get('fileName'),
        'imageUrl':art.get('imageUrl'),
        'caption':art.get('caption')
    })

@api.route('/arts',methods=['GET'])
def getAllArt():
    allArt=ArtBank.query.all()
    allArt=list(map(lambda x: x.serialize(),allArt))
    return jsonify(allArt)