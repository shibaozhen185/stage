# -*- coding: utf-8 -*-

import json
import sys
import posix
import time
import md5
import binascii
import socket
import select
from functools import wraps
import logging

class ApiRos:
    "Routeros api"
    def __init__(self, ip, user, passwd):
        self.currenttag = 0
        self.ip = ip
        self.user = user
        self.passwd = passwd
        self.sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sk.connect((ip, 8728))
        self.login(user, passwd)

    def login(self,username, pwd):
        for repl, attrs in self.talk(["/login", "=name=" + username,
                                      "=password=" + pwd]):
          if repl == '!trap':
            return False
          elif '=ret' in attrs.keys():
        #for repl, attrs in self.talk(["/login"]):
            chal = binascii.unhexlify(attrs['=ret'])
            md = md5.new()
            md.update('\x00')
            md.update(pwd)
            md.update(chal)
            for repl2, attrs2 in self.talk(["/login", "=name=" + username,
                   "=response=00" + binascii.hexlify(md.digest())]):
              if repl2 == '!trap':
                return False
        return True

    def talk(self, words):
        if self.writeSentence(words) == 0: return
        r = []
        while 1:
            i = self.readSentence();
            if len(i) == 0: continue
            reply = i[0]
            attrs = {}
            for w in i[1:]:
                j = w.find('=', 1)
                if (j == -1):
                    attrs[w] = ''
                else:
                    attrs[w[:j]] = w[j+1:]
            r.append((reply, attrs))
            if reply == '!done': return r

    def writeSentence(self, words):
        ret = 0
        for w in words:
            self.writeWord(w)
            ret += 1
        self.writeWord('')
        return ret

    def readSentence(self):
        r = []
        while 1:
            w = self.readWord()
            if w == '': return r
            r.append(w)

    def writeWord(self, w):
        print "<<< " + w
        self.writeLen(len(w))
        self.writeStr(w)

    def readWord(self):
        ret = self.readStr(self.readLen())
        print ">>> " + ret
        return ret

    def writeLen(self, l):
        if l < 0x80:
            self.writeStr(chr(l))
        elif l < 0x4000:
            l |= 0x8000
            self.writeStr(chr((l >> 8) & 0xFF))
            self.writeStr(chr(l & 0xFF))
        elif l < 0x200000:
            l |= 0xC00000
            self.writeStr(chr((l >> 16) & 0xFF))
            self.writeStr(chr((l >> 8) & 0xFF))
            self.writeStr(chr(l & 0xFF))
        elif l < 0x10000000:
            l |= 0xE0000000
            self.writeStr(chr((l >> 24) & 0xFF))
            self.writeStr(chr((l >> 16) & 0xFF))
            self.writeStr(chr((l >> 8) & 0xFF))
            self.writeStr(chr(l & 0xFF))
        else:
            self.writeStr(chr(0xF0))
            self.writeStr(chr((l >> 24) & 0xFF))
            self.writeStr(chr((l >> 16) & 0xFF))
            self.writeStr(chr((l >> 8) & 0xFF))
            self.writeStr(chr(l & 0xFF))

    def readLen(self):
        c = ord(self.readStr(1))
        if (c & 0x80) == 0x00:
            pass
        elif (c & 0xC0) == 0x80:
            c &= ~0xC0
            c <<= 8
            c += ord(self.readStr(1))
        elif (c & 0xE0) == 0xC0:
            c &= ~0xE0
            c <<= 8
            c += ord(self.readStr(1))
            c <<= 8
            c += ord(self.readStr(1))
        elif (c & 0xF0) == 0xE0:
            c &= ~0xF0
            c <<= 8
            c += ord(self.readStr(1))
            c <<= 8
            c += ord(self.readStr(1))
            c <<= 8
            c += ord(self.readStr(1))
        elif (c & 0xF8) == 0xF0:
            c = ord(self.readStr(1))
            c <<= 8
            c += ord(self.readStr(1))
            c <<= 8
            c += ord(self.readStr(1))
            c <<= 8
            c += ord(self.readStr(1))
        return c

    def writeStr(self, str):
        n = 0;
        while n < len(str):
            r = self.sk.send(str[n:])
            if r == 0: raise RuntimeError, "connection closed by remote end"
            n += r

    def readStr(self, length):
        ret = ''
        while len(ret) < length:
            s = self.sk.recv(length - len(ret))
            if s == '': raise RuntimeError, "connection closed by remote end"
            ret += s
        return ret

    def dict_convert(self, strs):
        d = {}
        for str in strs:
            # remove special char
            str = str.replace('=','',1).replace('*','')
            if str.find("=") == -1:
                continue
            key = str.split('=', 1)[0].replace('.','',1)
            value = str.split('=', 1)[1]
            d[key] = value

        return  d

    def excute_cli(self, inputsentence):
        self.writeSentence(inputsentence)
        list_ret=[]
        while True:
            ret = self.readSentence()
            if ret[0] == '!done':
                break

            result = self.dict_convert(ret)
            list_ret.append(result)

        start_time, end_time = getTime()

        logging.debug(
            "{end}: {input}={ret}".format(
                end=end_time,
                input=inputsentence,
                ret=str(list_ret),
            )
        )
        for ret in list_ret:
            for k,v in ret.items():
                if k == 'message':
                    raise BaseException(
                        "execute client failed."
                        "message is {mes}".format(
                            mes=str(v)
                        )
                    )
        return list_ret

    def __del__(self):
        self.sk.close()

def getTime():
    end_time_s = time.time()
    start_time_s = end_time_s - 60.0

    start_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time_s))
    end_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time_s))
    return (start_time, end_time)

def with_session(ip):
    def decorator(f):
        @wraps(f)
        def wrapper(*args,**kwargs):
            username = "admin"
            password = "yunex"
            apiros = ApiRos(ip,username,password)
            kwargs["with_session"]=apiros
            print dir(apiros)
            if not hasattr(f, '__wrapped__'):
                 kwargs.pop(apiros,None)
            return f(*args,**kwargs)
        wrapper.__wrapped__ = f
        return wrapper
    return decorator
