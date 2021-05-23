#!/usr/bin/env python3

__version__ = "0.1"
__author__ = "karthik@houseofkodai.in"

import sys
import os
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import threading
from urllib.parse import parse_qs
from io import BytesIO
from functools import partial

class Dejavu:
  '''
  data must be 16bit 16KHz PCM samples
  '''
  def __init__(self, path='.'):
    # load from path of pickles - from current-directory
    # to move-to directory of where the script resides
    #os.chdir(os.path.dirname(__file__))
    print('loading fingerprints from', os.getcwd())
    pass

  def fingerprint(self, name, data):
    '''
  returns tuple [HTTP-STATUS-CODE, STATUS-MESSAGE]
    [200, 'Updated']
    [201, 'Created']
    [406, 'Invalid Name/Data']
    '''
    if not name:
      return 400, '-ERR: name is missing (?name=)\n'
    return 201, 'pndng fingerprint of ' + name + ' ' + str(len(data)) + ' bytes\n'
    #return 201, '+Created (' + name + ')\n'

  def recognize(self, data):
    '''
  returns tuple [HTTP-STATUS-CODE, STATUS-MESSAGE]
    [200, 'Name']
    [404, 'Not Found']
    '''
    return 200, 'pndng recognition of ' + str(len(data)) + ' bytes\n'
    #return 404, None

class RequestHandler(SimpleHTTPRequestHandler):
  '''
  '''
  server_version = "vujade/" + __version__
  post_only_urls = ['/echo', '/fingerprint', '/recognize']

  def __init__(self, dejavu, *args, **kwargs):
    self.dejavu = dejavu
    super().__init__(*args, **kwargs)

  def echo(self,data):
    '''
    curl --header "Content-Type:application/octet-stream" --data-binary @asdf.file http://localhost:8080/echo
    '''
    self.send_response(200)
    self.send_header('Content-Type', self.headers.get('Content-Type', 'application/octect-stream'))
    self.end_headers()
    print("\33[32mreceived " + str(len(data)) + " bytes of data (" + str(len(data)/2) + " samples )\033[0;0m" )
    self.wfile.write(data)
    self.close_connection = True

  def do_POST(self):
    path, _, query_string = self.path.partition('?')
    if path not in self.post_only_urls:
      return self.send_error(403)
    qs = parse_qs(query_string)

    clen = int(self.headers.get('content-length', 0))
    if (clen < 1):
      return self.send_error(411) #Length Required

    # 1 MB
    if (clen > (1*(1024**2))):
      return self.send_error(411) #Length Required

    try:
      data = self.rfile.read(clen)
    except:
      self.send_error(500) #pndng

    if path == '/echo':
      return self.echo(data)

    # all paths after this require dejavu
    if not self.dejavu:
      return

    if path == '/fingerprint':
      qname = qs.get('name')
      if qname:
        qname = qname[0]
      else:
        qname = datetime.now().strftime('%Y%m-%d%H-%M%S')
      code, msg = self.dejavu.fingerprint(qname,data)

    if path == '/recognize':
      code, msg = self.dejavu.recognize(data)

    self.send_response(code)
    self.end_headers()
    if msg:
      self.wfile.write(msg.encode())

    self.close_connection = True
    return

  def do_GET(self):
    path, _, query_string = self.path.partition('?')
    if path == '/hello':
      return self.hello(parse_qs(query_string))
    elif path in self.post_only_urls: #restrict to POST only
      return self.send_error(403)
    else:
      super().do_GET() #serves directory-listing, files

  def hello(self,qs):
    self.send_response(200)
    self.send_header('Content-Type', 'text/plain')
    self.end_headers()
    response = BytesIO()
    response.write(b'hello: Active Threads='+
      str(threading.active_count()).encode() + b' Id=' +
      threading.currentThread().getName().encode() + b'\n')
    response.write(b'Headers: ' + str(self.headers).encode() + b'\n')
    response.write(b'Path: ' + self.path.encode() + b'\n')
    response.write(b'Query-String: ' + str(qs).encode() + b'\n')
    qsid = qs.get('id')
    if qsid:
      response.write(b'id=' + qsid[0].encode() + b'\n')
    self.wfile.write(response.getvalue())
    self.close_connection = True

class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
  pass

def httpd(dejavu=None, hostaddr='0.0.0.0', port=8080):
  svr = ThreadingSimpleServer((hostaddr, port), partial(RequestHandler,dejavu))
  svr.timeout = 5
  print('Starting http server, use <Ctrl-C> to stop')
  try:
    svr.serve_forever()
  except KeyboardInterrupt:
    pass
  svr.server_close()
  print("http server stopped.")

if __name__ == '__main__':
  argc = len(sys.argv) - 1
  if (argc > 0):
    if 'http' == sys.argv[1]:
      if (argc < 2):
        httpd(Dejavu())
      else:
        if (argc > 2):
          httpd(Dejavu(), sys.argv[2], sys.argv[3])
        else:
          httpd(Dejavu(), sys.argv[2])
      sys.exit(0)
    elif 'recognize' == sys.argv[1]:
      print(Dejavu().recognize(sys.stdin.buffer.read()))
      sys.exit(0)
    elif 'fingerprint' == sys.argv[1]:
      if (argc > 1):
        print(Dejavu().fingerprint(sys.argv[2], sys.stdin.buffer.read()))
        sys.exit(0)
  print('usage: vujade ' + __version__ + ''' [http*|fingerprint|recognize]
  http [port=8080] [hostaddr='0.0.0.0']
  recognize
  fingerprint <name>
''')
