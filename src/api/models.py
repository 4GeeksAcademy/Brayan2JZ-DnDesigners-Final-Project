from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    cards = db.relationship('CardBank', backref='User')
    favorites = db.relationship('Favorites', backref='User')
    three_d_models = db.relationship('ThreeDBank', backref='User')  # Link to ThreeDBank

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            # Do not serialize the password, it's a security breach
        }

class CardBank(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    filename = db.Column(db.String(40), unique=True, nullable=False)
    url = db.Column(db.Text, unique=True, nullable=False)
    tags = db.Column(db.Text, nullable=True)  # Change to false once we have a tagging system
    uploadedDate = db.Column(Date)
    favorites = db.relationship('Favorites', backref='card_bank')
    comments = db.relationship('CommentsBank', backref='card_bank')

    def __ref__(self):
        return f'<CardBank {self.filename}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'filename': self.filename,
            'url': self.url,
            'tags': self.tags,
            'uploadedDate': self.uploadedDate
        }

class ThreeDBank(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Link to User model
    filename = db.Column(db.String(40), unique=True, nullable=False)
    url = db.Column(db.Text, unique=True, nullable=False)
    tags = db.Column(db.Text, nullable=True)  # Change to false once we have a tagging system
    uploadedDate = db.Column(Date)
    description = db.Column(db.Text, nullable=True)  # Description for 3D models
    imageUrl = db.Column(db.Text, nullable=True)  # Image preview for 3D models
    comments = db.relationship('CommentsBank', backref='three_d_bank')  # Comments relationship

    def __ref__(self):
        return f'<ThreeDBank {self.filename}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'filename': self.filename,
            'url': self.url,
            'tags': self.tags,
            'uploadedDate': self.uploadedDate,
            'description': self.description,
            'imageUrl': self.imageUrl,
        }

class TagList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tagDescription = db.Column(db.String(50), unique=True, nullable=False)
    tagCount = db.Column(db.Integer, nullable=False)

    def __ref__(self):
        return f'<TagList {self.tagDescription}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'tagDescription': self.tagDescription,
            'tagCount': self.tagCount
        }

class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    imageID = db.Column(db.Integer, db.ForeignKey('card_bank.id'), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __ref__(self):
        return f'<Favorites {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'imageId': self.imageID,
            'userId': self.userId
        }

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, nullable=False, unique=True)
    following = db.Column(db.Text, nullable=True)

    def __ref__(self):
        return f'<Settings {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'following': self.following
        }

class ArtBank(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    fileName = db.Column(db.String(40), nullable=False, unique=True)
    imageUrl = db.Column(db.Text, nullable=False)
    caption = db.Column(db.Text, nullable=False)
    comments = db.relationship('CommentsBank', backref='art_bank')

    def __ref__(self):
        return f'<ArtBank {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'fileName': self.fileName,
            'imageUrl': self.imageUrl,
            'caption': self.caption
        }

class CommentsBank(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    imageId = db.Column(db.Integer, db.ForeignKey('card_bank.id'), nullable=True)
    artId = db.Column(db.Integer, db.ForeignKey('art_bank.id'), nullable=True)
    threeDId = db.Column(db.Integer, db.ForeignKey('three_d_bank.id'), nullable=True)  # Link to ThreeDBank
    comment = db.Column(db.Text, nullable=False)
    uploadedDate = db.Column(Date)
    
    def __ref__(self):
        return f'<CommentsBank {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'imageId': self.imageId,
            'artId': self.artId,
            'threeDId': self.threeDId,
            'comment': self.comment,
            'uploadedDate': self.uploadedDate
        }
