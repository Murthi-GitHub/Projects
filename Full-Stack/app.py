from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['test']
collection = db['names']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save', methods=['POST'])
def save_name():
    name = request.form['name']
    collection.insert_one({'name': name})
    return redirect(url_for('index'))

@app.route('/names')
def list_names():
    names = [doc['name'] for doc in collection.find()]
    return render_template('names.html', names=names)

if __name__ == '__main__':
    app.run(debug=True)
