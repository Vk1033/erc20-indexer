import { Card, CardBody, Stack, Text, Divider, Heading, Image, Box } from "@chakra-ui/react";
import { Utils } from "alchemy-sdk";

const TokenCard = ({ tokenDataObject, token }) => {
  console.log(tokenDataObject);
  return (
    <div className="card-border">
      <Card maxW="sm" borderBottom="sm" borderColor="blue">
        <CardBody>
          {tokenDataObject.logo && <Image src={tokenDataObject.logo} alt={tokenDataObject.symbol} boxSize="100px" />}
          <Stack mt="6" spacing="3">
            <Heading size="md">${tokenDataObject.symbol}&nbsp;</Heading>
            <Text color="blue.600" fontSize="2xl">
              <b>Balance:</b>&nbsp;
              {Utils.formatUnits(token.tokenBalance, tokenDataObject.decimals)}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
      </Card>
    </div>
  );
};
export default TokenCard;
