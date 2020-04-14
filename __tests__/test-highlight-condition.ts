/**
 * @format
 */

import { preprocess } from '@core/speech/nlp/preprocessor';
import { dataSources, speechOptions } from '../jest.setup';
import { DataSourceType } from '@data-at-hand/core/measure/DataSourceSpec';
import { NumericConditionType, Intent, VariableType } from '@data-at-hand/core';
import { ConditionInfo } from '@data-at-hand/core/speech/types';

console.log = jest.fn()

const prefixes = [
    "Highlight the days",
    "Count the days",
    "What are the days",
    "Number of days",
    "How many days",
]

const conditions: Array<[string, DataSourceType, ConditionInfo]> = [
    ["I walked more than 1000", DataSourceType.StepCount, { ref: 1000, type: NumericConditionType.More }],
    ["with step count more than 5000", DataSourceType.StepCount, { ref: 5000, type: NumericConditionType.More }],
    ["I was heavier than 150", DataSourceType.Weight, { ref: 150, type: NumericConditionType.More }],
    ["I was lighter than 150", DataSourceType.Weight, { ref: 150, type: NumericConditionType.Less }],
    ["with weight more than 100", DataSourceType.Weight, { ref: 100, type: NumericConditionType.More }],
    ["with weight higher than 100", DataSourceType.Weight, { ref: 100, type: NumericConditionType.More }],
    ["with weight lower than 100", DataSourceType.Weight, { ref: 100, type: NumericConditionType.Less }],
    ["I slept less than five hours", DataSourceType.HoursSlept, { ref: 3600*5, type: NumericConditionType.Less }],
    ["I slept shorter than five hours", DataSourceType.HoursSlept, { ref: 3600*5, type: NumericConditionType.Less }],
    ["I slept more than five hours", DataSourceType.HoursSlept, { ref: 3600*5, type: NumericConditionType.More }],
    ["I slept longer than five hours", DataSourceType.HoursSlept, { ref: 3600*5, type: NumericConditionType.More }],
    ["I went to bed earlier than 12 am", DataSourceType.SleepRange, { ref: 0, type: NumericConditionType.Less }],
    ["I went to bed earlier than 12:00 AM", DataSourceType.SleepRange, { ref: 0, type: NumericConditionType.Less }],
    ["I went to bed earlier than 12 pm", DataSourceType.SleepRange, { ref: 3600*12, type: NumericConditionType.Less }],
    ["I went to bed earlier than 12:00 PM", DataSourceType.SleepRange, { ref: 3600*12, type: NumericConditionType.Less }],
    ["I went to bed earlier than 12", DataSourceType.SleepRange, { ref: 0, type: NumericConditionType.Less }],

    ["I went to bed earlier than 11", DataSourceType.SleepRange, { ref: -3600, type: NumericConditionType.Less }],
    ["I went to bed earlier than Midnight", DataSourceType.SleepRange, { ref: 0, type: NumericConditionType.Less }],
    ["I got up later than Noon", DataSourceType.SleepRange, { ref: 3600*12, type: NumericConditionType.More }],
    ["I got up earlier than Noon", DataSourceType.SleepRange, { ref: 3600*12, type: NumericConditionType.Less }],
    ["I woke up later than 12", DataSourceType.SleepRange, { ref: 3600*12, type: NumericConditionType.More }],
    
]

describe("Inequation condition", () => {
    for (const prefix of prefixes) {
        describe("Prefix [" + prefix + "]", () => {
            for (const testcase of conditions) {
                it(testcase[0], async ()=> {
                    const result = await preprocess(prefix + " " + testcase[0], speechOptions)

                    const dataSourceId = Object.keys(result.variables).find(k => result.variables[k].type === VariableType.DataSource)
                    const conditionId = Object.keys(result.variables).find(k => result.variables[k].type === VariableType.Condition)
                    
                    let dataSource: DataSourceType
                    let condition: ConditionInfo
                    if(dataSourceId){
                        dataSource = result.variables[dataSourceId].value     
                    }
                    if(conditionId){
                        condition = result.variables[conditionId].value
                    }

                    expect(condition).toBeDefined()

                    if(dataSource == null){
                        dataSource = condition.impliedDataSource
                    }

                    expect(result.intent).toBe(Intent.Highlight)
                    expect(dataSource).toEqual(testcase[1])
                    expect(condition.type).toEqual(testcase[2].type)
                    expect(condition.ref).toEqual(testcase[2].ref)                   
                    
                })
            }
        })
    }
})