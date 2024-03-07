import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';
import { ChakraProvider, Heading, Container, Text, Link, Badge, Flex, Box, Button, useColorMode, Spinner } from '@chakra-ui/react';
import RosTopicList from './RosTopicList.jsx';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardHeader, CardBody, CardFooter, Switch,  Stack  } from '@chakra-ui/react'
// Import ResponsiveContainer from recharts

// Change your rendering code using createRoot in main.jsx
import { createRoot } from 'react-dom';
import { Code } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'


const root = createRoot(document.getElementById('root'));



function App() {
  const [rosConnected, setRosConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();

  const exampleData = [
    { timestamp: '12:00', status: true },
    { timestamp: '12:05', status: false },
    // Add more data points as needed
  ];

  const connectToROS = () => {
    setLoading(true);

    const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    ros.on('connection', () => {
      setRosConnected(true);
      setLoading(false);
      addConnectionHistory(true);
      setRosInstance(ros); 
    });

    ros.on('error', () => {
      setRosConnected(false);
      setLoading(false);
      addConnectionHistory(false);
    });

    ros.on('close', () => {
      setRosConnected(false);
      setLoading(false);
      addConnectionHistory(false);
    });

    return () => {
      ros.close();
    };
  };

  const disconnectFromROS = () => {
    if (rosInstance) {
      rosInstance.close();
      setRosInstance(null);
    }
  };

  const handleToggleColorMode = () => {
    console.log('Toggling color mode');
    toggleColorMode();
  };

  const addConnectionHistory = (status) => {
    setConnectionHistory((prevHistory) => [...prevHistory, { status, timestamp: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    console.log(connectionHistory);
  }, [connectionHistory]);

  const columns = [
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
    { field: 'status', headerName: 'Connection Status', width: 200 },
  ];



  

  return (
    <ChakraProvider>
      <Flex direction="column" align="center" minH="100vh" bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          p="4"
          bg={colorMode === 'light' ? 'teal.500' : 'teal.800'}
          color="white"
          w="100%"
          marginBottom="10px"
        >
          <Heading as="h1" size="lg" align ="center">
            ROS Web Interface 🚀
          </Heading>
          <Box>
            <header>
              <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
              </Button>
            </header>

          </Box>
        </Flex>
        <Container>  

        <Card align='center'>
              <CardHeader>
                    {/* Display ROS connection status */}
                    <Badge colorScheme={rosConnected ? 'green' : 'red'} marginBottom="4">
                      ROS {rosConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
              </CardHeader>
              <CardBody>
                <Text>Run your bridge launch file</Text>
              </CardBody>
              <CardFooter>
                  {/* Button to connect to ROS */}
                <Button onClick={connectToROS} colorScheme="teal" isLoading={loading} loadingText="Connecting">
                      Connect to ROS
                    </Button>   
                    {rosConnected && (
                      <Button onClick={disconnectFromROS} colorScheme="red" ml="4">
                        Disconnect from ROS
                      </Button>
                    )}
              </CardFooter>
            </Card>

            <Divider orientation='horizontal' />

            <Container>
               <RosTopicList />
            </Container>

 
        </Container>
      </Flex>
    </ChakraProvider>
  );
}
export default App;
