import React from "react";
import { Text, View } from "react-native";
import { Sizes } from "../../style/Sizes";
import { StyleTemplates } from "../../style/Styles";
import Colors from "../../style/Colors";
import { Button } from "react-native-elements";
import { sourceManager } from "../../system/SourceManager";
import { FitbitStepMeasure } from "../../measure/source/fitbit/FitbitStepMeasure";
import moment from 'moment';

export class ReportCard extends React.Component {
    render() {
        return (<View style={{
            position: 'absolute',
            left: Sizes.horizontalPadding,
            right: Sizes.horizontalPadding,
            top: Sizes.verticalPadding,
            bottom: Sizes.verticalPadding,
            ...StyleTemplates.backgroundCardStyle,
            backgroundColor: Colors.lightBackground,
            shadowRadius: 2,
            borderRadius: 16
        }}>
            <Button title="Load data" onPress={
                () => {
                    const measure = sourceManager.findMeasureByCode("fitbit:heart_rate")
                    measure.fetchData(
                        moment().subtract(7, "days").toDate().getTime(),
                        moment().endOf('day').toDate().getTime())
                        .then(result => {
                            console.log(result)
                        })
                }
            }></Button>
        </View>)
    }
}