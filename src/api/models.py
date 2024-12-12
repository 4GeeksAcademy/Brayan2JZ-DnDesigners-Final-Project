from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date

#from sqlalchemy import asc
#from sqlalchemy.ext.declarative import declarative_base

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    cards=db.relationship('CardBank', backref='user')
    favorites=db.relationship('Favorites', backref='user')
    comments=db.relationship('CommentsBank',backref='user')
    #settings=db.relationship('Settings',backref='user')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class CardBank(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    userId=db.Column(db.Integer, db.ForeignKey('user.id'),nullable=True)
    filename=db.Column(db.String(40),unique=True,nullable=False)
    url=db.Column(db.Text,unique=True,nullable=False)
    tags=db.Column(db.Text,nullable=True) #Change to false once we have a tagging system
    uploadedDate=db.Column(Date)
    favorites=db.relationship('Favorites', backref='card_bank')
    comments=db.relationship('CommentsBank',backref='card_bank')

    def __ref__(self):
        return f'<CardBank {self.filename}>'
    
    def serialize(self):
        return{
            'id':self.id,
            'userId':self.userId,
            'filename':self.filename,
            'url':self.url,
            'tags':self.tags,
            'uploadedDate':self.uploadedDate
        }

class ThreeDBank(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    userId=db.Column(db.Integer,nullable=True)
    filename=db.Column(db.String(40),unique=True,nullable=False)
    url=db.Column(db.Text,unique=True,nullable=False)
    uploadedDate=db.Column(Date)

    def __ref__(self):
        return f'<ThreeDBank {self.filename}>'
    
    def serialize(self):
        return{
            'id':self.id,
            'userId':self.userId,
            'filename':self.filename,
            'url':self.url,
            'uploadedDate':self.uploadedDate
        }

class TagList(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    tagDescription=db.Column(db.String(50),unique=True,nullable=False)
    tagCount=db.Column(db.Integer,nullable=False)

    # __mapper_args__ = {
    #     "order_by": asc(tagDescription)  # Default order by `name` in ascending order
    # }

    def __ref__(self):
        return f'<TagList {self.tagDescription}>'
    
    def serialize(self):
        return {
            'id':self.id,
            'tagDescription':self.tagDescription,
            'tagCount':self.tagCount
        }
    
class Favorites(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    imageID=db.Column(db.Integer, db.ForeignKey('card_bank.id'),nullable=False)
    userId=db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)

    def __ref__(self):
        return f'<Favorites {self.id}>'
    
    def serialize(self):
        return {
            'id':self.id,
            'imageId':self.imageID,
            'userId':self.userId
        }
    
class Settings(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    #userId=db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False,unique=True)
    #userName=db.Column(db.String(25),unique=True,nullable=True)
    following=db.Column(db.Text,nullable=True)

    def __ref__(self):
        return f'<Settings {self.id}>'
    
    def serialize(self):
        return {
            'id':self.id,
            #'userId':self.userId,
            #'userName':self.userName,
            'following':self.following
        }

class ArtBank(db.Model):
    id=db.Column(db.Integer,nullable=False, primary_key=True)
    fileName=db.Column(db.String(40),nullable=False, unique=True)
    imageUrl=db.Column(db.Text,nullable=False)
    caption=db.Column(db.Text,nullable=False)

    def __ref__(self):
        return f'<ArtBank {self.id}>'
    
    def serialize(self):
        return {
            'id':self.id,
            'fileName':self.fileName,
            'imageUrl':self.imageUrl,
            'caption':self.caption
        }
    
### COMMENTS STUFF
class CommentsBank(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    userId=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    imageId=db.Column(db.Integer,db.ForeignKey('card_bank.id'),nullable=False)
    artId=db.Column(db.Integer,nullable=True)
    comment=db.Column(db.Text,nullable=False)
    uploadDate=db.Column(Date)
    
    def __ref__(self):
        return f'<CommentsBank {self.id}>'
    
    def serialize(self):
        return{
            'id':self.id,
            'imageId':self.imageId,
            'artId':self.artId,
            'comment':self.comment,
            'uploadDate':self.uploadDate
        }