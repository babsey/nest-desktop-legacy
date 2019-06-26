# Singularity

**Application containers for Linux (https://www.sylabs.io/singularity/)**

### Install

Install Singularity on Linux (See https://www.sylabs.io/guides/3.2/user-guide/)

#### Install dependencies and Go

###### Ubuntu 18.04
Install dependencies
```
sudo apt-get update && sudo apt-get install -y \
    build-essential \
    libssl-dev \
    uuid-dev \
    libgpgme11-dev \
    squashfs-tools \
    libseccomp-dev \
    wget \
    pkg-config
```

Install Go (1.10)
```
sudo apt-get install golang-go
```
Alternative option to install Go from the source code (1.12)
```
$ export VERSION=1.12 OS=linux ARCH=amd64 && \
    wget https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz && \
    sudo tar -C /usr/local -xzvf go$VERSION.$OS-$ARCH.tar.gz && \
    rm go$VERSION.$OS-$ARCH.tar.gz

```
Then, set up your environment for Go.
```
$ echo 'export GOPATH=${HOME}/go' >> ~/.bashrc && \
    echo 'export PATH=/usr/local/go/bin:${PATH}:${GOPATH}/bin' >> ~/.bashrc && \
    source ~/.bashrc
```


###### OpenSuse 15.0 (Leap)
Install dependencies
```
sudo zypper update && sudo zypper install -y \
    devel_basis \
    openssl-devel \
    libuuid-devel \
    libgpgme11 \
    squashfs \
    libseccomp-devel \
    wget
```
Install Go (1.12)
```
sudo zypper update && sudo zypper install -y \
    go1.12
```

#### Install Singularity
```
mkdir -p ~/go/src/github.com/sylabs/
cd ~/go/src/github.com/sylabs/
export VERSION=3.2.0
wget https://github.com/sylabs/singularity/releases/download/v${VERSION}/singularity-${VERSION}.tar.gz
tar -xzf singularity-${VERSION}.tar.gz

cd ~/go/src/github.com/sylabs/singularity
./mconfig
make -C builddir
sudo make -C builddir install
```

### Usage

Build a Singularity image (with sudo)
```
sudo singularity build image.sif recipe.def
```

Run the user-defined default command within a container
```
singularity run image.sif
```

Run a shell within a container
```
singularity shell image.sif
```

Run a command within a container
```
singularity exec image.sif /bin/bash
```


### Singularity recipe to build an image
An example of a definition file
```
Bootstrap: library
From: ubuntu:18.04
Stage: build

%setup
    touch /file1
    touch ${SINGULARITY_ROOTFS}/file2

%files
    /file1
    /file1 /opt

%environment
    export LISTEN_PORT=12345
    export LC_ALL=C

%post
    apt-get update && apt-get install -y netcat
    NOW=`date`
    echo "export NOW=\"${NOW}\"" >> $SINGULARITY_ENVIRONMENT

%runscript
    echo "Container was created $NOW"
    echo "Arguments received: $*"
    exec echo "$@"

%startscript
    nc -lp $LISTEN_PORT

%test
    grep -q NAME=\"Ubuntu\" /etc/os-release
    if [ $? -eq 0 ]; then
        echo "Container base is Ubuntu as expected."
    else
        echo "Container base is not Ubuntu."
    fi

%labels
    Author d@sylabs.io
    Version v0.0.1

%help
    This is a demo container used to illustrate a def file that uses all
    supported sections
```
