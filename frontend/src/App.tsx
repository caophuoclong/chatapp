import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Flex, useColorMode } from '@chakra-ui/react';
function App() {
  const {toggleColorMode, colorMode} = useColorMode();
  console.log(colorMode);
  return (
    <div className="App">
      <Flex>
        <Button onClick={()=> toggleColorMode()}>
          Toggle Mode
        </Button>
      </Flex>
    </div>
  );
}

export default App;
