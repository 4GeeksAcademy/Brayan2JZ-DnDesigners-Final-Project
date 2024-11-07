from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc
from sqlalchemy.ext.declarative import declarative_base



db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            # do not serialize the password, its a security breach
        }
    
class CardBank(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    filename=db.Column(db.String(40),unique=True,nullable=False)
    url=db.Column(db.Text,unique=True,nullable=False)
    tags=db.Column(db.Text,nullable=True) #Change to false once we have a tagging system

    def __ref__(self):
        return f'<User {self.filename}>'
    
    def serialize(self):
        return{
            'id':self.id,
            'filename':self.filename,
            'url':self.url,
            'tags':self.tags
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
    