import React from 'react';
import { ViewStyle, View, Text, StyleSheet, Dimensions, LayoutAnimation, Animated, Easing } from 'react-native';
import { Sizes } from '../../style/Sizes';
import { connect } from 'react-redux';
import { ReduxAppState } from '../../state/types';
import { SpeechRecognizerState, SpeechRecognizerSessionStatus } from '../../state/speech/types';
import { ThunkDispatch } from 'redux-thunk';
import Colors from '../../style/Colors';
import Spinner from 'react-native-spinkit';

const styles = StyleSheet.create({
    containerStyle: {
        padding: Sizes.horizontalPadding,
        paddingTop: Sizes.verticalPadding,
        paddingBottom: Sizes.verticalPadding,
        alignItems: 'center'
    },

    listeningTextStyle: {
        color: Colors.speechAffordanceColorBackground,
        fontSize: Sizes.normalFontSize,
        fontWeight: '500',
        marginLeft: 4
    },

    waitingTextStyle: {
        color: Colors.accent,
        fontSize: Sizes.smallFontSize,
        fontWeight: '500',
        marginLeft: 12
    },

    titleContainerStyle: {
        flexDirection: 'row', alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    dictatedMessageStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.link,
        fontSize: Sizes.smallFontSize
    },

    exampleTextTitleStyle: {
        color: Colors.speechExampleTextColor,
        fontSize: Sizes.normalFontSize,
        marginBottom: 8
    },

    exampleTextSentenceStyle: {
        color: Colors.speechExampleTextColor,
        fontSize: Sizes.normalFontSize,
        fontWeight: '600',
        marginTop: 6,
        marginRight: 3, marginLeft: 3
    }
})

interface Props {
    recognizerState?: SpeechRecognizerState,
    exampleSentences?: string[],
}

interface State {
}

class SpeechInputPanel extends React.Component<Props, State>{

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    private isRecognizedTextExists(state: SpeechRecognizerState): boolean {
        return !(state.dictationResult == null
            || state.dictationResult.text == null
            || state.dictationResult.text.length === 0)
    }

    componentDidUpdate(prevProps: Props) {
        if (this.isRecognizedTextExists(prevProps.recognizerState) === false && this.isRecognizedTextExists(this.props.recognizerState) === true) {
            /*LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    500, LayoutAnimation.Types.easeInEaseOut, "opacity")
            )*/
        }
    }

    render() {

        switch (this.props.recognizerState.status) {
            case SpeechRecognizerSessionStatus.Waiting:
                return <View style={styles.containerStyle}>
                    <View style={styles.titleContainerStyle}>
                        <Spinner size={20} isVisible={true} type="FadingCircle" color={Colors.accent} />
                        <Text style={styles.waitingTextStyle}>Processing the previous command...</Text>
                    </View>
                </View>
            default:
                return <View style={styles.containerStyle}>

                <View style={styles.titleContainerStyle}>
                    <Spinner size={20} isVisible={true} type="Wave" color={Colors.speechAffordanceColorBackground} />
                    <Text style={styles.listeningTextStyle}>Listening...</Text>
                </View>
    
                {
                    this.isRecognizedTextExists(this.props.recognizerState) === true ? <Text style={styles.dictatedMessageStyle}>
                        {
                            this.props.recognizerState.dictationResult ? (this.props.recognizerState.dictationResult.diffResult ?
                                this.props.recognizerState.dictationResult.diffResult.map((diffElm, i) => {
                                    if (diffElm.added == null && diffElm.removed == null) {
                                        return <Text key={i} >{diffElm.value}</Text>
                                    } else if (diffElm.added === true) {
                                        return <Text key={i} style={{ color: Colors.accent }}>{diffElm.value}</Text>
                                    }
                                }) : this.props.recognizerState.dictationResult.text) : null
                        }
                        _</Text>
                        : <View style={{
                            alignItems: 'center'
                        }}>
                            <Text style={styles.exampleTextTitleStyle}>Say something like:</Text>
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                            }}>
                                <Text style={styles.exampleTextSentenceStyle}>"Show all data"</Text>
                                <Text style={styles.exampleTextSentenceStyle}>"Go to heart rate"</Text>
                            </View>
                        </View>
                }
            </View>
        }
    }
}



function mapDispatchToProps(dispatch: ThunkDispatch<{}, {}, any>, ownProps: Props): Props {
    return {
        ...ownProps,
    }
}

function mapStateToProps(appState: ReduxAppState, ownProps: Props): Props {
    return {
        ...ownProps,
        recognizerState: appState.speechRecognizerState
    }
}


const connected = connect(mapStateToProps, mapDispatchToProps)(SpeechInputPanel)

export { connected as SpeechInputPanel }