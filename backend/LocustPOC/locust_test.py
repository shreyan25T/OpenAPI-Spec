from locust import HttpUser, task, between

class LocustTestUser(HttpUser):
    wait_time = between(1, 3)
    @task
    def createChat(self):
        
        # Handle JSON payload
        payload = {'answer': {'answer': 'some answer', 'followupQuestions': ['question 1', 'question 2', 'question 3'], 'imageUrl': 'image url', 'multipleChoices': ['choice 1', 'choice 2', 'choice 3'], 'videoUrl': 'video url'}, 'query': 'question 1', 'sessionId': '66e93bee3c32b364888f7ce1'}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/chat", json=payload)

    @task
    def updateChat(self):
        
        # Handle JSON payload
        payload = {'chatid': '66e97107fac171e5b55ef0cc', 'data': {'feedback': -1}}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/chatupdate", json=payload)

    @task
    def createIssue(self):
        
        # Handle JSON payload
        payload = {'Feedback': 'Frequent issue', 'sessionId': '66e93bee3c32b364888f7ce1'}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/issue", json=payload)

    @task
    def fetchResponse(self):
        
        # Handle JSON payload
        payload = {'action': 'summarize', 'context': {'profile': {'entry_point': 'GSave', 'feeling': 'Feeling stressed, struggling to manage', 'goal': 'Paying off debts', 'role': 'Contribute to decisions', 'situation': ['I am able to regularly save']}, 'suggest_followup_questions': True}, 'messages': [{'content': 'What are the limitations of technical analysis?', 'role': 'user'}]}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/response", json=payload)

    @task
    def getSession(self):
        # Dynamic query parameters
        entrypoint = 'GFunds'
        userid = '217010000647397352740'
        sessionid = '66e9710afac171e5b55ef0cd'
        self.client.get(f"/ROOT_PREFIX/session?entrypoint={entrypoint}&userid={userid}&sessionid={sessionid}")
    @task
    def createSession(self):
        
        # Handle JSON payload
        payload = {'entrypoint': 'GSave', 'userid': '127010000647397352740'}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/session", json=payload)

    @task
    def deleteSession(self):
        # Dynamic query parameters
        sessionid = '66e9710afac171e5b55ef0cd'
        type = 'chat'
        
        # Handle JSON payload
        payload = {}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/sessiondelete?sessionid={sessionid}&type={type}", json=payload)

    @task
    def updateSession(self):
        
        # Handle JSON payload
        payload = {'data': {'isArchived': {}, 'lastUpdate': 1727331189.0030868, 'sessionName': 'Test 3'}, 'sessionId': '66e97107fac171e5b55ef0cc'}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/sessionupdate", json=payload)

    @task
    def getSuggestions(self):
        # Dynamic query parameters
        name = 'GFunds'
        self.client.get(f"/ROOT_PREFIX/suggestions?name={name}")
    @task
    def getUser(self):
        # Dynamic query parameters
        userid = '217010000647397352740'
        entrypoint = 'GInvest'
        self.client.get(f"/ROOT_PREFIX/users?userid={userid}&entrypoint={entrypoint}")
    @task
    def createUser(self):
        
        # Handle JSON payload
        payload = {'Name': 'Alice', 'userId': '127010000647397352740'}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/users", json=payload)

    @task
    def updateUser(self):
        
        # Handle JSON payload
        payload = {'data': {'GCryptoTermsAccepted': True, 'GFundsTermsAccepted': True, 'GInsureTermsAccepted': True, 'GInvestTermsAccepted': True, 'GSaveTermsAccepted': True, 'GStocksTermsAccepted': True, 'LearningTermsAccepted': True, 'userProfile': {'entry_point': 'GSave', 'feeling': ' Feeling stressed, struggling to manage', 'goal': 'Paying off debts', 'role': 'Contribute to decisions', 'situation': ['I am able to regularly save']}}, 'userId': '127010000647397352740'}

        # Send JSON payload
        self.client.post(f"/ROOT_PREFIX/usersupdate", json=payload)



