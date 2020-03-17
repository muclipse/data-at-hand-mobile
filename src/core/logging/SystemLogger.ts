import { DirectoryLogger } from "@core/logging/DirectoryLogger"
import { ExplorationInfo } from "@core/exploration/types"
import { SpeechContext } from "@core/speech/nlp/context"
import { ActionTypeBase } from "@state/types"
import Share from 'react-native-share'
import { randomString } from "@utils/utils"

enum LogFileName {
    SpeechCommandLogs = "speech_command.jsonl",
    InteractionTransitionLogs = "interaction_state_transition.jsonl"
}

enum InteractionTransitionLogType {
    Transition = "trans",
    VerboseEvent = "event"
}

export class SystemLogger {
    private static _instance: SystemLogger | undefined = undefined

    static get instance(): SystemLogger {
        if (this._instance == null) {
            this._instance = new SystemLogger()
        }
        return this._instance
    }

    private constructor() { }

    private _sessionId: string | null = null
    private currentLogger: DirectoryLogger | null = null

    public enabled = false

    set sessionId(id: string) {
        console.log("set logging session id: ", id)
        this._sessionId = id;
        if (id) {
            this.currentLogger = new DirectoryLogger("logs/" + id)
        } else {
            this.currentLogger = null
        }
    }

    get sessionId(): string | null {
        return this._sessionId
    }

    get logDirectoryPath(): string | null {
        if (this.currentLogger) {
            return this.currentLogger.fullDirectoryPath
        } else return null
    }

    async clearLogsInCurrentSession(): Promise<void> {
        if (this.currentLogger) {
            await this.currentLogger.removeAllFilesInDirectory()
        }
    }

    async logSpeechCommandResult(text: string, explorationInfo: ExplorationInfo, context: SpeechContext, resultingAction: ActionTypeBase): Promise<void> {
        if (this.currentLogger && this.enabled === true) {
            await this.currentLogger.appendJsonLine(LogFileName.SpeechCommandLogs,
                {
                    inputText: text,
                    explorationInfo,
                    speechContext: context,
                    resultingAction
                })
        } else return;
    }

    makeLogId(timestamp: number): string{
        return "log_" + timestamp + "_" + randomString(10)
    }

    async logVerboseToInteractionStateTransition(event: string, content: Object, logId?: string, timestamp?: number): Promise<void> {
        if (this.currentLogger && this.enabled === true) {

            if(timestamp == null){
                timestamp = Date.now()
            }

            if (logId == null) {
                logId = this.makeLogId(timestamp);
            }

            await this.currentLogger.appendJsonLine(LogFileName.InteractionTransitionLogs,
                {
                    type: InteractionTransitionLogType.VerboseEvent,
                    id: logId,
                    event,
                    ...content
                }, timestamp)
        } else return
    }

    async logInteractionStateTransition(serviceKey: string, action: ActionTypeBase, nextInfo: ExplorationInfo, logId?: string, timestamp?: number): Promise<void> {
        if (this.currentLogger && this.enabled === true) {
            
            if(timestamp == null){
                timestamp = Date.now()
            }

            if (logId == null) {
                logId = this.makeLogId(timestamp);
            }

            await this.currentLogger.appendJsonLine(LogFileName.InteractionTransitionLogs,
                {
                    type: InteractionTransitionLogType.Transition,
                    id: logId,
                    service: serviceKey,
                    //prevInfo: prevState.info,
                    action,
                    nextInfo
                }, timestamp)
        } else return
    }

    async exportLogs(): Promise<boolean> {
        if (this.currentLogger) {
            const zipResult = await this.currentLogger.zipLogs()
            if (zipResult) {
                try {
                    const shareResult = await Share.open({
                        url: "file://" + zipResult.filePath,
                        type: zipResult.mimeType,
                        showAppsToView: true
                    })
                    console.log(shareResult)
                    return true
                } catch (e) {
                    console.log(e)
                    return false
                }
            } else return false
        } else return false
    }
}