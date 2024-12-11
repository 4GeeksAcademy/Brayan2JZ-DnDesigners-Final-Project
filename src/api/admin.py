  
import os
from flask_admin import Admin
from .models import db, User,CardBank,TagList,Favorites,Settings,ArtBank,CommentsBank,ThreeDBank
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
    admin.add_view(ModelView(User, db.session))

    admin.add_view(ModelView(CardBank, db.session))

    admin.add_view(ModelView(TagList, db.session))
    
    admin.add_view(ModelView(Favorites, db.session))

    admin.add_view(ModelView(ArtBank, db.session))

    admin.add_view(ModelView(Settings, db.session))

    admin.add_view(ModelView(CommentsBank, db.session))

    admin.add_view(ModelView(ThreeDBank, db.session))