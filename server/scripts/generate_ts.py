import os
import pathlib
from shutil import copyfile

def generateTypeScript(filePath:str):
    tsFilePath = filePath.replace('.js', '.ts')
    if not os.path.exists(tsFilePath):
        copyfile(src=filePath, dst=tsFilePath)
        return
    
def recursiveDirectory(path:str):
    if os.path.isfile(path=path):
        if path[-3:] == '.js':
            generateTypeScript(filePath=path)
        return
    for item in os.listdir(path=path):
        if item != 'node_modules':
            recursiveDirectory(os.path.join(path, item))
    return

ROOT_DIR = pathlib.Path().resolve()
recursiveDirectory(ROOT_DIR)