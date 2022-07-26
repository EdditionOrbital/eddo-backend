from pymongo import MongoClient
import json
import glob
import random
from tqdm import trange, tqdm
import faker
import requests
import string
import pymongo
import os


def getJsonFromUrl(url):
    x = requests.get(url)
    return json.loads(x.text)

DB_NAME = 'eddo'
MONGODB_URI = os.getenv('MONGODB_URI')

url = f"{MONGODB_URI}"
client = MongoClient()
if MONGODB_URI:
    client = MongoClient(url)

client.drop_database(DB_NAME)
db = client[DB_NAME]

all_modules = list(json.load(open('_AllModules2018.json', 'r')))
fake = faker.Faker()

print('Inserting Modules')
MODS_N = 30
modules = []
lessons = []
prevSize = 0
for year in [2021, 2022]:
    temp = []
    while len(temp) < (MODS_N // 2):
        mod = random.choice(all_modules)
        mod_data = {}
        try:
            mod_data = getJsonFromUrl(
                f'https://api.nusmods.com/v2/{year}-{year + 1}/modules/{mod}.json'
            )
        except:
            continue
        if len(mod_data['semesterData']) < 2: continue
        for sem in mod_data['semesterData']:
            if len(sem['timetable']) == 0: break
            mod_id = f"{mod}-{year}-{sem['semester']}"
            temp.append({
                "id": mod_id,
                "title": mod_data['title'],
                "description": mod_data['description'],
                "credits": mod_data['moduleCredit']
            })
            for lesson in sem['timetable']:
                lessons.append({
                    "code": lesson['classNo'],
                    "moduleId": mod_id,
                    "startTime": lesson['startTime'],
                    "endTime": lesson['endTime'],
                    "venue": lesson['venue'],
                    "day": lesson['day'],
                    "weeks": lesson['weeks'],
                    "lessonType": lesson['lessonType']
                })
    modules += temp
print()

print('Inserting Students')
STUDENTS_N = 100
students = []
for _ in trange(STUDENTS_N):
    mYear = random.choice([2021, 2022])
    firstName = fake.first_name()
    lastName = fake.last_name()
    modulesTaken = []
    codes = []
    for year in range(mYear, 2023):
        for sem in [1, 2]:
            if year == 2022 and sem == 2: continue
            current_sem_mods = list(
                filter(lambda x: f"{year}-{sem}" in x['id'], modules))
            current_sem_mods = list(
                filter(lambda x: x['id'][:-7] not in codes, current_sem_mods))
            taken_mods = random.sample(
                current_sem_mods,
                min(random.randint(4, 6), len(current_sem_mods)))
            for mod in taken_mods:
                codes.append(mod['id'][:-7])
                possible_lessons = list(
                    filter(lambda l: l['moduleId'] == mod['id'], lessons))
                if (possible_lessons == []): continue
                lectures = list(
                    filter(lambda l: l['lessonType'] == 'Lecture',
                           possible_lessons))
                tutorials = list(
                    filter(lambda l: l['lessonType'] == 'Tutorial',
                           possible_lessons))
                sec = list(
                    filter(lambda l: l['lessonType'] == 'Sectional Teaching',
                           possible_lessons))
                chosen_lec = list(
                    map(lambda x: f'Lecture-{x["code"]}',
                        random.sample(lectures, min(len(lectures), 2))))
                chosen_tut = list(
                    map(lambda x: f'Tutorial-{x["code"]}',
                        random.sample(tutorials, min(len(tutorials), 2))))
                chosen_sec = list(
                    map(lambda x: f'Sectional Teaching-{x["code"]}',
                        random.sample(sec, min(len(sec), 2))))
                all_chosen = chosen_lec + chosen_tut
                modulesTaken.append({
                    "moduleId": mod['id'],
                    "lessons": all_chosen,
                    "role": "Student"
                })
    students.append({
        "id":
        f"A0{mYear % 2000}{random.randint(1000,9999)}{random.choice(string.ascii_uppercase)}",
        "firstName": firstName,
        "lastName": lastName,
        "email":
        f"{firstName.lower()}{random.choice(['_','.',''])}{lastName.lower()}@u.nus.edu",
        "password": "password",
        "mYear": mYear,
        "modules": modulesTaken
    })
print()

print('Inserting Staff')
STAFF_N = 8
staffs = []
for _ in trange(STAFF_N):
    firstName = fake.first_name()
    lastName = fake.last_name()
    modulesTaken = []
    codes = []
    for year in [2021, 2022, 2023]:
        for sem in [1, 2]:
            current_sem_mods = list(
                filter(lambda x: f"{year}-{sem}" in x['id'], modules))
            current_sem_mods = list(
                filter(lambda x: x['id'][:-7] not in codes, current_sem_mods))
            taken_mods = random.sample(
                current_sem_mods,
                min(random.randint(2, 4), len(current_sem_mods)))
            for mod in taken_mods:
                codes.append(mod['id'][:-7])
                possible_lessons = list(
                    filter(lambda l: l['moduleId'] == mod['id'], lessons))
                if (possible_lessons == []): continue
                lectures = list(
                    filter(lambda l: l['lessonType'] == 'Lecture',
                           possible_lessons))
                tutorials = list(
                    filter(lambda l: l['lessonType'] == 'Tutorial',
                           possible_lessons))
                sec = list(
                    filter(lambda l: l['lessonType'] == 'Sectional Teaching',
                           possible_lessons))
                chosen_lec = list(
                    map(lambda x: f'Lecture-{x["code"]}',
                        random.sample(lectures, min(len(lectures), 2))))
                chosen_tut = list(
                    map(lambda x: f'Tutorial-{x["code"]}',
                        random.sample(tutorials, min(len(tutorials), 2))))
                chosen_sec = list(
                    map(lambda x: f'Sectional Teaching-{x["code"]}',
                        random.sample(sec, min(len(sec), 2))))
                all_chosen = chosen_lec + chosen_tut
                modulesTaken.append({
                    "moduleId": mod['id'],
                    "lessons": all_chosen,
                    "role": "AProf"
                })
    staffs.append({
        "id":
        f"B0{mYear % 2000}{random.randint(1000,9999)}{random.choice(string.ascii_uppercase)}",
        "firstName": firstName,
        "lastName": lastName,
        "email":
        f"{firstName.lower()}{random.choice(['_','.',''])}{lastName.lower()}@nus.edu.sg",
        "password": "password",
        "title": 'AProf',
        "modules": modulesTaken
    })
print()

print('Inserting Folders and Files')
files = []
for module in tqdm(modules):
    main_folder = {
        "title": f"{module['id']}-MAIN",
        "parentFolder": None,
        "moduleId": module['id'],
        "openDate": None,
        "closeDate": None
    }
    ids = [db.folders.insert_one(main_folder).inserted_id]
    for _ in range(random.randint(4, 12)):
        folder_id = random.choice(ids)
        folder = {
            "title": fake.word().capitalize(),
            "parentFolder": folder_id,
            "moduleId": module['id'],
            "openDate": None,
            "closeDate": None
        }
        ids.append(db.folders.insert_one(folder).inserted_id)
    for _ in range(random.randint(10, 20)):
        filename = fake.file_name()
        file = {
            "title": filename,
            "path": f"/static/files/{filename}",
            "size": round(random.uniform(1, 5), 2),
            "parentFolder": random.choice(ids),
            "moduleId": module['id'],
            "openDate": None,
            "closeDate": None
        }
        files.append(file)

db.files.insert_many(files)
db.modules.insert_many(modules)
db.lessons.insert_many(lessons)

try:
    db.students.insert_many(students)
except pymongo.errors.BulkWriteError as e:
    print(e.details['writeErrors'])
    
try:
    db.staffs.insert_many(staffs)
except pymongo.errors.BulkWriteError as e:
    print(e.details['writeErrors'])