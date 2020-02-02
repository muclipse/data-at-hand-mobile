import React from 'react';
import { LayoutRectangle } from "react-native"
import Svg, { G, Line, Text as SvgText } from "react-native-svg"
import Colors from "../../../../style/Colors"
import { Sizes } from "../../../../style/Sizes"
import { ScaleBand, ScaleLinear } from "d3-scale"

export const CycleChartFrame = (props:{
    chartContainerWidth: number,
    chartContainerHeight: number,
    chartArea: LayoutRectangle,
    cycleDomain: number[],
    xTickFormat: (num:number)=>string,
    scaleX: ScaleBand<number>,
    scaleY: ScaleLinear<number, number>,
    ticks?: number[],
    yTickFormat?: (number) => string,
    children?: any
})=>{



    return <Svg width={props.chartContainerWidth} height={props.chartContainerHeight}>
    <G x={props.chartArea.x} y={props.chartArea.y + props.chartArea.height}>
        <Line x1={0} x2={props.chartArea.width} y={0} stroke={Colors.textColorDark} strokeWidth={0.5} />
        {
            props.cycleDomain.map(dimension => <SvgText
                key={dimension}
                textAnchor={"middle"}
                alignmentBaseline="hanging"
                fontSize={Sizes.smallFontSize}
                fill={Colors.textColorLight}
                y={12}
                x={props.scaleX(dimension) + props.scaleX.bandwidth() * .5}>{props.xTickFormat(dimension)}</SvgText>)
        }
    </G>
    <G x={props.chartArea.x} y={props.chartArea.y}>
        {
            (props.ticks || props.scaleY.ticks()).map(tick => {
                return <G key={tick} x={0} y={props.scaleY(tick)}>
                    <SvgText textAnchor="end" fill={Colors.chartElementDefault} alignmentBaseline="central" x={-8}>{props.yTickFormat ? props.yTickFormat(tick) : tick}</SvgText>
                    <Line x1={0} x2={props.chartArea.width} y={0} stroke={Colors.chartAxisLightColor} />
                </G>
            })
        }
    </G>
    {
        props.children
    }
</Svg>
}