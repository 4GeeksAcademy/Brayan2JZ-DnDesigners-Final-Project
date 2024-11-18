"""empty message

<<<<<<<< HEAD:migrations/versions/5d05b500ec6b_.py
Revision ID: 5d05b500ec6b
Revises: 
Create Date: 2024-11-14 00:58:35.941136
========
Revision ID: b338d2f257da
Revises: 
Create Date: 2024-11-07 20:40:11.682248
>>>>>>>> d5a45a2a62fd3a35895cfb47c4ac6a53ef014a7a:migrations/versions/b338d2f257da_.py

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
<<<<<<<< HEAD:migrations/versions/5d05b500ec6b_.py
revision = '5d05b500ec6b'
========
revision = 'b338d2f257da'
>>>>>>>> d5a45a2a62fd3a35895cfb47c4ac6a53ef014a7a:migrations/versions/b338d2f257da_.py
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('card_bank',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=True),
    sa.Column('filename', sa.String(length=40), nullable=False),
    sa.Column('url', sa.Text(), nullable=False),
    sa.Column('tags', sa.Text(), nullable=True),
    sa.Column('uploadedDate', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('filename'),
    sa.UniqueConstraint('url')
    )
    op.create_table('favorites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('imageID', sa.Integer(), nullable=False),
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tag_list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('tagDescription', sa.String(length=50), nullable=False),
    sa.Column('tagCount', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('tagDescription')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('tag_list')
    op.drop_table('settings')
    op.drop_table('favorites')
    op.drop_table('card_bank')
    # ### end Alembic commands ###
