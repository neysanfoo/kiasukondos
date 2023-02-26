FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /backed

WORKDIR /backend

COPY . /backend/

RUN pip install --upgrade pip && pip install pip-tools && pip install -r requirements.txt 