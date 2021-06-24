import csv
import itertools
import json

"""
Initial Function to start reading the CSV file with all the codes.
"""
def replaceNewLine(row):
    if '&#xD;&#xA;' in row:
        rowReplaced = row.replace('&#xD;&#xA;','\n')
        return rowReplaced

def openFileAndCreateDictionary(fileName):
    codeList = {}
    with open(fileName, newline='\n',encoding="utf-8", errors='ignore') as csvFile:
        csvFile.readline()
        codeList = readCSVFile(codeList,csvFile)
    return codeList



def readCSVFile(codeList, csvFile):
    rowReader = csv.reader(csvFile, delimiter=',')

    for row in rowReader:
        #print(row)
        row[1] = replaceNewLine(row[1])
        if row[0] in codeList:
            codeList[row[0]].append(row[1])
        else:
            codeList[row[0]] = [row[1]]

    return codeList

def writeCodeFiles(codeList):
    for keys in codeList:
        for content in codeList[keys]:
           # print(content)
            with open(keys+".js","a",encoding="utf8", ) as codeFile:
               # print(content)
                if(len(content) > 1):
                    for codeContent in content:
                        codeFile.write(codeContent)
                else:
                    codeFile.write(content)

codelist = openFileAndCreateDictionary("F:\\new.csv")

writeCodeFiles(codelist)


# def openFileAndCreateDictionaryJson(file):
#     with open(file, encoding="utf8") as jsonFile:
#         jsonLoaded = json.loads(jsonFile, encoding="utf-8")
#         for item in jsonLoaded:
#             print('')
#
#
#
# openFileAndCreateDictionaryJson("F:\\new.csv")
