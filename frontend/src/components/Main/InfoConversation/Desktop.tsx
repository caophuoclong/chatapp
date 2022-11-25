import React, { Component } from 'react';
import Common, { CommonProps } from './Common';
interface DesktopProps extends CommonProps {}
export default class Desktop extends Common<DesktopProps> {
  constructor(props: DesktopProps) {
    super(props);
  }
  render() {
    return <>{super.render()}</>;
  }
}
