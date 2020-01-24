import React from 'react';
import { connect } from "react-redux";
import { ExplorationDataState } from '../../../../state/exploration/data/reducers';
import { Dispatch } from 'redux';
import { ReduxAppState } from '../../../../state/types';
import { ScrollView } from 'react-native';
import { ExplorationType } from '../../../../core/exploration/types';
import { OverviewData } from '../../../../core/exploration/data/types';
import { DataSourceChartFrame } from '../../../exploration/DataSourceChartFrame';
import { dataSourceManager } from '../../../../system/DataSourceManager';
import { ExplorationState } from '../../../../state/exploration/interaction/reducers';


interface Props {
    dataState?: ExplorationDataState,
    explorationState?: ExplorationState
}

interface State {

}

class ExplorationMainPanel extends React.Component<Props>{

    render() {
        const info = this.props.dataState.info || this.props.explorationState.info
        switch (info.type) {
            case ExplorationType.B_Ovrvw:

                if (this.props.dataState.data != null) {
                    const overviewData = this.props.dataState.data as OverviewData
                    return <ScrollView>
                        {
                            overviewData.sourceDataList.map(sourceEntry => {
                                return <DataSourceChartFrame key={sourceEntry.source.toString()} sourceType={sourceEntry.source} 
                                todayMeasureTitle={sourceEntry.today && sourceEntry.today.label} 
                                todayMeasureValue={sourceEntry.today && sourceEntry.today.formatted}
                                statistics={sourceEntry.statistics}
                                />
                            })
                        }
                    </ScrollView>
                }else return <></>
        }
    }
}




function mapDispatchToProps(dispatch: Dispatch, ownProps: Props): Props {
    return {
        ...ownProps,
    }
}

function mapStateToProps(appState: ReduxAppState, ownProps: Props): Props {
    return {
        ...ownProps,
        dataState: appState.explorationDataState,
        explorationState: appState.explorationState
    }
}


const connected = connect(mapStateToProps, mapDispatchToProps)(ExplorationMainPanel)

export { connected as ExplorationMainPanel }