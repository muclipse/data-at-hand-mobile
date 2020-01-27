import {
  ExplorationInfo,
  ParameterType,
  ParameterKey,
  ExplorationType,
  ExplorationMode,
  ExplorationInfoParameter,
} from './types';

class ExplorationInfoHelper {

  getParameterValue<T>(
    stateInfo: ExplorationInfo,
    parameter: ParameterType,
    key?: ParameterKey,
  ): T {
    const found = stateInfo.values.find(
      v => v.parameter === parameter && (key == null || v.key === key),
    );
    if (found) {
      return found.value;
    } else return null;
  }

  setParameterValue(
    stateInfo: ExplorationInfo,
    value: any,
    parameter: ParameterType,
    key?: ParameterKey,
  ) {
    const index = stateInfo.values.findIndex(
      entry =>
        entry.parameter === parameter && (key == null || entry.key === key),
    );
    if (index >= 0) {
      stateInfo.values[index].value = value;
    } else {
      stateInfo.values.push({
        parameter: parameter,
        key: key,
        value: value,
      });
    }
  }

  filterParameters(stateInfo: ExplorationInfo, filterFunc:(parameter: ExplorationInfoParameter)=>boolean){
    stateInfo.values = stateInfo.values.filter(param => filterFunc(param) === true)
  }

  getMode(stateInfo: ExplorationInfo): ExplorationMode {
    switch (stateInfo.type) {
      case ExplorationType.B_Day:
      case ExplorationType.B_Ovrvw:
      case ExplorationType.B_Range:
        return ExplorationMode.Browse;
      case ExplorationType.C_Cyclic:
      case ExplorationType.C_CyclicDetail:
      case ExplorationType.C_TwoRanges:
        return ExplorationMode.Compare;
    }
  }
}

const explorationInfoHelper = new ExplorationInfoHelper();

export {explorationInfoHelper};