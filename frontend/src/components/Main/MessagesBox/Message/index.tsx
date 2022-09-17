import React from 'react';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage';

type Props = {};

export default function Message({}: Props) {
  return (
    <div>
      {/* <MyMessage message="hio" time="123" /> */}
      <OtherMessage message="23" time="123" />
    </div>
  );
}
