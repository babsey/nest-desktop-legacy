### STAGE 1: Build NEST ###
FROM ubuntu:18.04 as nest-builder
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    cython3 \
    git \
    libgsl0-dev \
    libltdl7-dev \
    libncurses5-dev \
    libreadline6-dev \
    python3-all-dev \
    python3-numpy

WORKDIR /tmp
RUN git clone https://github.com/compneuronmbu/nest-simulator.git && \
    cd /tmp/nest-simulator && \
    git fetch && \
    git checkout nest-3 && \
    git checkout 4348e5 && \
    mkdir /tmp/nest-build

WORKDIR /tmp/nest-build
RUN cmake -DCMAKE_INSTALL_PREFIX:PATH=/opt/nest/ -Dwith-python=3 /tmp/nest-simulator && \
    make && \
    make install && \
    rm -rf /tmp/*


### STAGE 2: Setup ###
FROM ubuntu:18.04
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y \
    git \
    libgsl0-dev \
    libltdl7-dev \
    nginx \
    python3-numpy \
    python3-pip

RUN pip3 install flask==0.12.4 flask-cors && \
    git clone https://github.com/babsey/nest-server /opt/nest-server && \
    rm -rf /var/www/html/*

COPY --from=nest-builder /opt/nest /opt/nest
COPY ./html/* /var/www/html/

WORKDIR /opt/nest-server
EXPOSE 80 5000

RUN chmod 755 entrypoint.sh
ENTRYPOINT ["entrypoint.sh", "/opt/nest"]
