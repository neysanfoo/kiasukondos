FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /kiasukondo_api

WORKDIR /kiasukondo_api

COPY . /kiasukondo_api/

RUN pip install --upgrade pip && pip install pip-tools && pip install -r requirements.txt  && python manage.py migrate && python manage.py loaddata fixtures.json && python manage.py collectstatic --noinput

EXPOSE 8000