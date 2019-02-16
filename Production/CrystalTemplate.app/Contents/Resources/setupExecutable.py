#!/usr/bin/env python
import sys
import subprocess

resourcesPath = sys.argv[1]
subprocess.check_output(['openssl', 'base64', '-d', '-in', resourcesPath + 'Crystal64', '-out', resourcesPath + 'Crystal'])
subprocess.check_output(['chmod', '+x', resourcesPath + 'Crystal'])