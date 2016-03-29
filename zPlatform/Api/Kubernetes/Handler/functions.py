#coding=utf-8

import time,os

def curDatetime():
    return time.strftime('%Y-%m-%d %X', time.localtime())

def curDir():
    return os.getcwd()