#### Install python and pip
#### Install virtualenvwrapper

#### Create a virtual environment
```
pip install gunicorn
```
#### Install nginx and update your nginx.conf to run on port 80

#### Go to directory containing codebase
```
pip install -r requirements.txt
```

#### Make changes to ALLOWED_HOSTS in backend/settings.py file to include your ip-address

#### Create migrations
```
python manage.py migrate  --run-syncdb
```

#### Run gunicorn application server
```
gunicorn -b 0.0.0.0:8000 backend.wsgi
```


## Steps to run application
This application requires input format in ```YYYY-MM-DD``` format. For best experience use datepicker.

For third party api this application uses Dark Sky api
