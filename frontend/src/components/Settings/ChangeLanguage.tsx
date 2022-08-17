import { Stack, Switch, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import {ReactComponent as US} from "~/assets/icons/US.svg"
import {ReactComponent as VN} from "~/assets/icons/VN.svg"
import moment from 'moment';
import 'moment/locale/vi';
type Props = {}

export default function ChangeLanguage({}: Props) {
    const [lan, setLang] = useState<"en" | "vn">(window.localStorage.getItem("lan") as "en" | "vn" | null || "vn");
    const {t,i18n} = useTranslation();
    
    useEffect(()=>{
        i18n.changeLanguage(lan);
        window.localStorage.setItem("lan", lan);
        moment.locale(lan === "vn" ? "vi": "es")
    },[lan])
  return (
    <Stack direction={"row"}>
        <Text>
            {t("Language")}
        </Text>
        <VN width={32} height={24}/>
        <Switch isChecked={lan === "en"} onChange={()=>{
            if(lan === "en"){
                setLang("vn")
            }else{
                setLang("en")
            }
        }}/>
        <US  width={32} height={24} radius="10px"/>
    </Stack>
  )
}