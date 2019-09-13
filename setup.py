import setuptools
import sys

assert sys.version_info >= (3,), "Python 3 is required to run NEST Desktop"

with open("README.md", "r") as fh:
    long_description = fh.read()

VERSION = "2.0"

setuptools.setup(
    name="nest-desktop",
    version=VERSION + ".0",
    description="A web-based GUI application for NEST Simulator",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/babsey/nest-desktop",
    license="MIT License",
    packages=setuptools.find_packages(),
    include_package_data=True,
    scripts=["bin/nest-desktop"],
    classifiers=[
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
    ],
    python_requires=">=3.6",
    install_requires=[
        "nest-server>=" + VERSION
    ],
)
