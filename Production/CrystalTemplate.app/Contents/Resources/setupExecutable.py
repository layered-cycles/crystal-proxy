#!/usr/bin/env python
import sys
import os
import subprocess

resourcesPath = sys.argv[1]
executableFilePath = resourcesPath + 'Crystal'
executableDoesNotExist = os.path.isfile(executableFilePath) == False
if executableDoesNotExist:
    encodedExecutableFilePath = resourcesPath + 'Crystal64'
    decodeExecutableCommand = 'openssl base64 -d -in %(encodedExecutableFilePath)s -out %(executableFilePath)s' % {
        'encodedExecutableFilePath': encodedExecutableFilePath,
        'executableFilePath': executableFilePath}
    subprocess.call(decodeExecutableCommand, shell=True)
    makeFileExecutableCommand = 'chmod +x %(executableFilePath)s' % {
        'executableFilePath': executableFilePath}
    subprocess.call(makeFileExecutableCommand, shell=True)
devnull = open(os.devnull, 'wb')
spawnExecutableCommand = 'nohup %(executableFilePath)s' % {
    'executableFilePath': executableFilePath}
subprocess.Popen(spawnExecutableCommand,
                 stdout=devnull, stderr=devnull, shell=True)
