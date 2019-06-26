'''
Taken from:
https://gist.github.com/chrisbolin/2e90bc492270802d00a6
http://stackoverflow.com/users/1074592/fakerainbrigand
http://stackoverflow.com/questions/15401815/python-simplehttpserver
'''

import os
import sys
import optparse

try:
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    from SocketServer import TCPServer
    from urlparse import urlparse
except ImportError:
    from http.server import SimpleHTTPRequestHandler
    from socketserver import TCPServer
    from urllib.parse import urlparse



class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):

        # Parse query data to find out what was requested
        parsedParams = urlparse(self.path)

        # See if the file requested exists
        if os.access('.' + os.sep + parsedParams.path, os.R_OK):
            # File exists, serve it up
            SimpleHTTPRequestHandler.do_GET(self)
        else:
            # send index.html, but don't redirect
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            with open('index.html', 'r') as fin:
                self.copyfile(fin, self.wfile)


if __name__ == '__main__':
    parser = optparse.OptionParser("usage: python serve.py [options]")
    parser.add_option("-d", "--dirpath", dest="dirpath", default='.',
                      type="string", help="directory path to index.html")
    parser.add_option("-p", "--port", dest="port", default=3000,
                      type="int", help="port to run on")
    (options, args) = parser.parse_args()
    os.chdir(options.dirpath)

    httpd = TCPServer(("", options.port), Handler)
    print("Serving %s/index.html at port %s." %(options.dirpath, options.port))
    httpd.serve_forever()
