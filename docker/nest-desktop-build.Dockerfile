### STAGE 1: Builder ###
FROM ubuntu:18.04 as nest-builder
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
    python3-numpy \
    wget


# install 'nest simulator'
WORKDIR /tmp
RUN VERSION=2.18.0 && \
    wget -O nest-simulator-$VERSION.tar.gz https://github.com/nest/nest-simulator/archive/v$VERSION.tar.gz && \
    tar -zxf nest-simulator-$VERSION.tar.gz && \
    mkdir /tmp/nest-build && cd /tmp/nest-build && \
    cmake -DCMAKE_INSTALL_PREFIX:PATH=/opt/nest/ -Dwith-python=3 /tmp/nest-simulator-$VERSION && \
    make -j 4 && make install && \
    rm -rf /tmp/simulator-$VERSION /tmp/nest-build


### STAGE 2: Setup ###
FROM ubuntu:18.04
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y \
    libgsl-dev \
    libltdl-dev \
    python3-numpy \
    python3-pip && \
    pip3 install nest-desktop==2.0.0

COPY --from=nest-builder /opt/nest /opt/nest

EXPOSE 5000 8000

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
