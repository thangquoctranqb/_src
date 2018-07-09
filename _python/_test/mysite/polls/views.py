from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import hashlib
import hmac
import base64

@csrf_exempt
def callback(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        message = bytes(str(body), 'utf-8')                      #body
        secret = bytes('jp1UjLhmnmEbA', 'utf-8')                    #appid
        hash = hmac.new(secret, message, hashlib.sha256)
        signature = base64.b64encode(hash.digest())
        print (signature)
        print (str(body))
    return HttpResponse('NOT_FOUND')