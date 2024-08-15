import { Steps } from 'antd'
import React from 'react'

const StepComponent = ({curent = 0, items = []}) => {
  const { Step } = Steps;

  return (
    <Steps current={curent}>
      {items.map((item) => {
        return(
          <Step key={item.title} title={item.title}  icon={item.icon} description={item.description}/>
        )
      })}
        
    </Steps>
  )
}

export default StepComponent
