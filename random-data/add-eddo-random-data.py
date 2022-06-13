from pymongo import MongoClient
import json
import glob
import names
import random
from tqdm import trange, tqdm
import faker
import requests
import string

def getJsonFromUrl(url):
	x = requests.get(url)
	return json.loads(x.text)

HOST = 'localhost'
PORT = '27107'
DB_NAME = 'eddo'

url = f"mongodb://{HOST}:{PORT}/"
client = MongoClient()

client.drop_database(DB_NAME)
db = client[DB_NAME]

all_modules = list(json.load(open('_AllModules2018.json', 'r')))
fake = faker.Faker()

print('Inserting Modules')
MODS_N = 100
modules = []
lessons = []
for year in [2019, 2020, 2021]:
	mods = random.sample(all_modules, MODS_N)
	for mod in tqdm(mods):
		mod_data = {}
		try: mod_data = getJsonFromUrl(f'https://api.nusmods.com/v2/{year}-{year + 1}/modules/{mod}.json')
		except: continue
		for sem in mod_data['semesterData']:
			mod_id = f"{mod}-{year}-{sem['semester']}"
			modules.append({
				"id": mod_id,
				"title": mod_data['title'],
				"description": mod_data['description'],
				"credits": mod_data['moduleCredit'],
				"files": { "title": "root" }
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
print()

print('Inserting Students')
STUDENTS_N = 1500
students = []
for _ in trange(STUDENTS_N):
	mYear = random.choice([2019, 2020, 2021])
	firstName = fake.first_name()
	lastName = fake.last_name()
	modulesTaken = []
	codes = []
	for year in [2019, mYear + 1]:
		for sem in [1, 2]:
			current_sem_mods = list(filter(lambda x: f"{year}-{sem}" in x['id'], modules))
#			current_sem_mods = list(filter(lambda x: x['id'][:-7] not in codes, current_sem_mods))
			taken_mods = random.sample(current_sem_mods, min(random.randint(5, 7), len(current_sem_mods)))
			for mod in taken_mods:
				codes.append(mod['id'][:-7])
				possible_lessons = list(filter(lambda l: l['moduleId'] == mod['id'], lessons))
				if (possible_lessons == []): continue
				lectures = list(filter(lambda l: l['lessonType'] == 'Lecture', possible_lessons))
				tutorials = list(filter(lambda l: l['lessonType'] == 'Tutorial', possible_lessons))
				sec = list(filter(lambda l: l['lessonType'] == 'Sectional Teaching', possible_lessons))
				chosen_lec = list(map(lambda x: f'Lecture-{x["code"]}', random.sample(lectures, min(len(lectures), 2))))
				chosen_tut = list(map(lambda x: f'Tutorial-{x["code"]}', random.sample(tutorials, min(len(tutorials), 2))))
				chosen_sec = list(map(lambda x: f'Sectional Teaching-{x["code"]}', random.sample(sec, min(len(sec), 2))))
				all_chosen = chosen_lec + chosen_tut
				modulesTaken.append({
					"moduleId": mod['id'],
					"lessons": all_chosen,
					"role": "Student"
				})
	students.append({
		"id": f"A0{mYear % 2000}{random.randint(1000,9999)}{random.choice(string.ascii_uppercase)}",
		"firstName": firstName,
		"lastName": lastName,
		"email": f"{firstName.lower()}{random.choice(['_','.',''])}{lastName.lower()}@u.nus.edu",
		"password": "password",
		"mYear": mYear,
		"modules": modulesTaken
	})
print()

db.modules.insert_many(modules)
db.lessons.insert_many(lessons)
db.students.insert_many(students)