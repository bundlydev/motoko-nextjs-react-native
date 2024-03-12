import { Button, Alert } from "react-native";

import { useAuth, useCandidActor } from "@bundly/ares-react";
import { AuthButton } from "@bundly/ares-react-native";

import { CandidActors } from "../canisters";

export default function IndexScreen() {
  const backend = useCandidActor<CandidActors>("test") as CandidActors["test"];

    async function handlePress() {
        try {
            const response = await backend.whoAmI();

            Alert.alert("My principal", response.toString());
        } catch (error: any) {
          Alert.alert("My principal", error.message || error);
        }
    }

  return <>
    <AuthButton />
    <Button title="Get principal" onPress={handlePress} />
    </>;
}
