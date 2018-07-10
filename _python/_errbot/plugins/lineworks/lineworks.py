from errbot import BotPlugin, botcmd, arg_botcmd, webhook


class Lineworks(BotPlugin):
    """
    connect to message bot&#39;s lineworks
    """

    @webhook
    def callback(self, request):
        self.push_message('!tryme')
        return testbot.pop_message()
