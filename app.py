from flask import Flask, render_template, request, jsonify, g, session, redirect, url_for
from database import close_db, get_db
from flask_session import Session
from form import UsernameForm
from functools import wraps

app = Flask(__name__)

app.config["SECRET_KEY"] = "MY_SECRET_KEY"

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.teardown_appcontext
def close_db_at_end_of_request(e=None):
    close_db(e)

@app.before_request
def load_logged_in_user():
    g.user = session.get("username",None)

@app.route("/",methods=["GET","POST"])
def index():
    if g.user == None:
        return redirect(url_for("username"))
    return render_template("home.html")

@app.route("/home",methods=["GET","POST"])
def home():
    if g.user == None:
        return redirect(url_for("username"))
    return render_template("home.html")

@app.route("/username",methods=["GET","POST"])
def username():
    form = UsernameForm()
    if form.validate_on_submit():
        username = form.username.data
        session.clear()
        session["username"] = username
        print(username)
        return redirect(url_for("home"))
    return render_template("username.html",form=form)
