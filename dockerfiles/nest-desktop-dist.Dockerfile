### STAGE 1: Build NEST Simulator ###
FROM ubuntu:18.04 as simulator-builder
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    cython3 \
    git \
    libgsl-dev \
    libltdl-dev \
    libncurses5-dev \
    libreadline-dev \
    python3-all-dev \
    python3-numpy

RUN git clone https://github.com/nest/nest-simulator.git /tmp/nest-simulator && \
    cd /tmp/nest-simulator && \
    git fetch --tags && \
    git checkout v2.16.0

RUN mkdir /tmp/nest-build && \
    cd /tmp/nest-build && \
    cmake -DCMAKE_INSTALL_PREFIX:PATH=/opt/nest-simulator/ -Dwith-python=3 /tmp/nest-simulator && \
    make && \
    make install && \
    rm -rf /tmp/simulator /tmp/nest-build


### STAGE 2: Setup ###
FROM ubuntu:18.04
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y \
    git \
    libgsl-dev \
    libltdl-dev \
    nginx \
    python3-numpy \
    python3-pip

RUN pip3 install flask==0.12.4 flask-cors && \
    git clone https://github.com/babsey/nest-server /opt/nest-server && \
    rm -rf /var/www/html

COPY --from=simulator-builder /opt/nest-simulator /opt/nest-simulator
COPY ./dist/nest-desktop /var/www/html
COPY entrypoint.sh .

EXPOSE 80 5000
RUN chmod 755 /entrypoint.sh
ENTRYPOINT "/entrypoint.sh"
