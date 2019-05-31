FROM ubuntu:18.04
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    curl \
    cython3 \
    git \
    libgsl0-dev \
    libltdl7-dev \
    libncurses5-dev \
    libreadline6-dev \
    nginx \
    python3-all-dev \
    python3-numpy \
    python3-pip

WORKDIR /tmp
RUN git clone https://github.com/compneuronmbu/nest-simulator.git && \
    cd /tmp/nest-simulator && \
    git fetch && \
    git checkout v2.16.0 && \
    mkdir /tmp/nest-build

WORKDIR /tmp/nest-build
RUN cmake -DCMAKE_INSTALL_PREFIX:PATH=/opt/nest-simulator/ -Dwith-python=3 /tmp/nest-simulator && \
    make && \
    make install && \
    rm -rf /tmp/*

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

RUN pip3 install flask==0.12.4 flask-cors && \
    git clone https://github.com/babsey/nest-server /opt/nest-server

COPY ./dist/nest-desktop /tmp/nest-desktop
WORKDIR /tmp/nest-desktop
RUN npm i && \
    npm run build && \
    rm -rf /var/www/html/* && \
    mv /tmp/nest-desktop/* /var/www/html/

WORKDIR /tmp/
EXPOSE 80 5000

RUN chmod 755 entrypoint.sh
ENTRYPOINT "entrypoint.sh"
