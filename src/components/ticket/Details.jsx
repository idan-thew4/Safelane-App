import React, { useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";




const Details = ({ headline, dataPoints, textMobile }) => {

    // console.log(dataPoints);


    // const data = [{ value: 0 }, { value: 0 }];
    // const percentage = {};

    // dataPoints.forEach((dataPoint, index) => {
    //     const key = `data-${index}`;
    //     const value = parseInt(dataPoint[0]);
    //     percentage[key] = [{ value: 100 }, { value: value }];

    // })

    // const colors = ['#D9D9D9', '#1A8AFF', , '#1A8AFF'];


    return (
        <>
            <h2 className="details__title head_30">{headline}</h2>
            {/* <p className="details__content-mobile parag_18">{textMobile}</p> */}
            <h3 className="head_20">מה הסיכון בעברה?</h3>

            <div className="content" dangerouslySetInnerHTML={{ __html: dataPoints }} />

            {/* <ul className="details__list-container">
                {dataPoints.map((dataPoint, index) => (
                    <li className="details__data-container" key={index}>
                        <PieChart className="details__pie-chart" width={100} height={100}>
                            <Pie
                                data={percentage[`data-${index}`]}
                                cx={46}
                                cy={45}
                                startAngle={0}
                                endAngle={-400}
                                innerRadius={35}
                                outerRadius={48}
                                fill="#8884d8"
                                paddingAngle={-10}
                                dataKey="value"
                                cornerRadius={40}
                                
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="details__content">
                            <h3 className="head_30">{dataPoint[0]}%</h3>
                            <p className="parag_18">{dataPoint[1]}</p>
                        </div>
                    </li>
                ))}
            </ul> */}


        </>
    )
}

export default Details;





