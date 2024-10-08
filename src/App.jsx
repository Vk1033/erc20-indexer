import { Box, Button, Center, Flex, Heading, Image, Input, SimpleGrid, Text, CircularProgress } from "@chakra-ui/react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useState } from "react";
import TokenCard from "./TokenCard";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [ifError, setIfError] = useState(false);

  async function getWalletTokens() {
    setHasQueried(false);
    setIsLoading(true);
    if (!window.ethereum.selectedAddress) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }
    getTokenBalance(null, window.ethereum.selectedAddress);
  }

  async function getTokenBalance(_, queryAddress = userAddress) {
    console.log("queryAddress", queryAddress);
    setIsLoading(true);
    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };

    let data;
    const alchemy = new Alchemy(config);
    try {
      data = await alchemy.core.getTokenBalances(queryAddress);
    } catch (e) {
      console.error(e);
      setIfError(true);
      setIsLoading(false);
      return;
    }

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(data.tokenBalances[i].contractAddress);
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
    setIsLoading(false);
    setIfError(false);
  }
  return (
    <Box w="100vw">
      <Center>
        <Flex alignItems={"center"} justifyContent="center" flexDirection={"column"}>
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>Plug in an address and this website will return all of its ERC-20 token balances!</Text>
        </Flex>
      </Center>
      <Flex w="100%" flexDirection="column" alignItems="center" justifyContent={"center"}>
        <Heading mt={42}>Get all the ERC-20 token balances of this address:</Heading>
        <Input onChange={(e) => setUserAddress(e.target.value)} color="black" w="600px" textAlign="center" p={4} bgColor="white" fontSize={24} />
        {ifError && (
          <Text fontSize={15} color="red">
            There was an error
          </Text>
        )}
        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>
        <Button fontSize={20} onClick={getWalletTokens} mt={36} bgColor="blue">
          Check Wallet ERC-20 Token Balances
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <SimpleGrid w={"90vw"} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => (
              <TokenCard tokenDataObject={tokenDataObjects[i]} token={e} key={i} />
            ))}
          </SimpleGrid>
        ) : isLoading ? (
          <CircularProgress isIndeterminate />
        ) : (
          "this is where the results will be displayed"
        )}
      </Flex>
    </Box>
  );
}

export default App;
