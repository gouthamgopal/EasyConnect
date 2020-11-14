from scholarly import scholarly
import requests
from flask import Response
from tokenizor import populate_keyword
import json
from dbConfig import databaseSetup

def getAurthorObj(name):
    try:
        search_query = scholarly.search_author(name)
        author = next(search_query).fill()
        return author
    except:
        return None

def getAuthorInterests(author):
    return author.interests
    
def getPublicationList(author):
    return author.publications

def getAllAbstract(pubList):
    res={}
    for i in range(len(pubList)):
        try:
            pub = author.publications[i].fill().bib
            res[pub["title"]]=pub["abstract"]
            if i==20:
                break
        except:
            i-=1
            pass
    return res

if __name__ == "__main__":
    dbObj = databaseSetup()
    collection=dbObj['ScholarList']
    # print(col.find_one({},{"Adeel Bhutta":1}))
    with open('researchersList.json', 'r') as f:
        data=json.load(f)
    for department in data:
        print('---------------{}--------------------'.format(department))
        for entry in data[department]:
            print('---------------{}'.format(entry))
            author = getAurthorObj(entry["name"])
            if author==None:
                continue
            pub_list = getPublicationList(author)
            abs_val = getAllAbstract(pub_list)
            researcher = {}
            researcher[entry["name"]] = []
            for key in abs_val:
                keywords = populate_keyword(abs_val[key])
                researcher[entry["name"]].append({"title":key,"keywords":keywords})
            payload.append(researcher)
    with open('payload.txt', 'w+') as f:
        f.write(str(payload))
    collection.insert_many(payload)
