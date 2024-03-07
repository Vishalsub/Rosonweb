import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';
import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'

const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const Heading = styled.h2`
  color: #333;
`;

const List = styled.ul`
  list-style-type: circle;
  padding-left: 20px;
`;

const MessagesHeading = styled.h2`
  color: #333;
  margin-top: 20px;
`;

const MessagesList = styled.ul`
  list-style-type: square;
  padding-left: 20px;
  overflow-y: auto; /* Add this line for scrollbar */
  max-height: 200px; /* Adjust the max height as needed */
`;



const RosTopicList = () => {
  const [topics, setTopics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receivedMessagesCount, setReceivedMessagesCount] = useState(0);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    // Create a listener for /my_topic
    const myTopicListener = new ROSLIB.Topic({
      ros,
      name: '/my_topic',
      messageType: 'std_msgs/String',
    });

    // When we receive a message on /my_topic, add its data to the "messages" state
    myTopicListener.subscribe((message) => {
      setMessages((prevMessages) => [...prevMessages, message.data]);
      setReceivedMessagesCount((prevCount) => prevCount + 1);
    });

    ros.on('connection', () => {
      console.log('Connected to ROS');
      ros.getTopics((topicList) => {
        setTopics(topicList);
      });
    });

    ros.on('error', (error) => {
      console.error('Error connecting to ROS:', error);
    });

    return () => {
      // Cleanup code if needed
      ros.close();
      myTopicListener.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Card align='center'>
        <CardHeader>
          <Heading>ROS Topics</Heading>
          <List>
            {Array.isArray(topics) ? (
              topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))
            ) : (
              <li>No topics available</li>
            )}
          </List>
        </CardHeader>
        <CardBody>
          <MessagesHeading>Messages on /my_topic</MessagesHeading>
          <MessagesList>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </MessagesList>
        </CardBody>
        <CardFooter>
        <StatGroup>
            <Stat>
              <StatLabel>Received</StatLabel>
              <StatNumber>{receivedMessagesCount}</StatNumber>
              {/* You can customize the increase indicator based on your requirement */}
              <StatHelpText>
                <StatArrow type='increase' />
              </StatHelpText>
            </Stat>
          </StatGroup>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default RosTopicList;
