import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";

const PasswordInput = React.forwardRef<any, any>(({ error, isInvalid, icon: Icon, placeholder, returnKeyType, onSubmitEditing, onBlur, onChangeText, value }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <Input variant="outline" size="lg" isInvalid={isInvalid}>
            <InputSlot className="pl-4"><InputIcon as={Icon} /></InputSlot>
            <InputField
                ref={ref}
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                autoCapitalize='none'
                onBlur={onBlur}
                onChangeText={onChangeText}
                value={value}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
            <InputSlot className="pr-4" onPress={() => setShowPassword(!showPassword)}>
                <InputIcon as={showPassword ? Eye : EyeOff} className="text-typography-500" />
            </InputSlot>
        </Input>
    )
})
PasswordInput.displayName = 'PasswordInput';

export default PasswordInput
