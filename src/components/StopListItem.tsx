import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Check, ChevronDown, ChevronUp, Clock, MapPin, Trash } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Pressable, TouchableOpacity } from 'react-native';
import { Place } from '../model/places.types';
import { formatDuration } from '../utils/format/time';

const StopListItem = ({
    isVisited,
    landmark,
    onVisitToggle,
    onDelete,
    displayNumber,
    onLocate,
    onPress,
    visitDuration,
    onEditDuration,
}: {
    isVisited: boolean,
    landmark: Place,
    onVisitToggle: () => void,
    onDelete: () => void,
    displayNumber: number,
    onLocate: () => void,
    onPress: () => void,
    visitDuration?: number,
    onEditDuration?: () => void,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isPersonal = landmark.creation_type === "PERSONAL";
    const formattedDuration = visitDuration ? formatDuration(visitDuration) : null;

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <VStack>
            <Pressable onPress={onPress}
                className='flex-row items-center justify-between'
            >
                <HStack space='md' className='flex-1 items-center min-w-0'>
                    <Box className={`w-8 h-8 rounded-full items-center justify-center ${isVisited ? 'bg-success-500' : 'bg-background-100'}`}>
                        {isVisited ? (
                            <Icon as={Check} size="xs" />
                        ) : (
                            <Text size='xs' className='font-bold text-typography-900'>
                                {displayNumber}
                            </Text>
                        )}
                    </Box>

                    <VStack className='flex-1 '>
                        <HStack space="xs" className="items-center">
                            <Text
                                className={`font-semibold ${isVisited ? 'text-typography-300 line-through' : 'text-typography-900'}`}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {landmark.name}
                            </Text>
                        </HStack>

                        <HStack space="xs" className="items-center">
                            <Icon as={MapPin} size="sm" className="text-typography-400" />
                            <Text
                                className="text-typography-400"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                size="sm"
                            >
                                {isPersonal ? "Custom" : landmark.municipality}
                            </Text>
                            {formattedDuration && (
                                <>
                                    <Icon as={Clock} size="sm" className="text-typography-400" />
                                    <Text className="text-typography-400"
                                        size="sm"
                                    >
                                        Stay: {formattedDuration}
                                    </Text>
                                </>
                            )}
                        </HStack>
                    </VStack>
                </HStack>

                <Button
                    variant='link'
                    action='secondary'
                    onPress={toggleExpand}
                >
                    <ButtonIcon as={isExpanded ? ChevronUp : ChevronDown} />
                </Button>
            </Pressable>

            {isExpanded && (
                <HStack className='pt-3 mt-3 border-t border-outline-100 justify-around items-center'>
                    <TouchableOpacity onPress={() => { toggleExpand(); onVisitToggle(); }} className='items-center w-16'>
                        <Box className='bg-background-100 p-2.5 rounded-full mb-1.5'>
                            <Icon as={Check} size='md' className={isVisited ? 'text-typography-500' : 'text-primary-600'} />
                        </Box>
                        <Text size='2xs' className='text-typography-600 font-medium text-center'>{isVisited ? 'Unvisit' : 'Visited'}</Text>
                    </TouchableOpacity>

                    {onEditDuration && (
                        <TouchableOpacity onPress={() => { toggleExpand(); onEditDuration(); }} className='items-center w-16'>
                            <Box className='bg-background-100 p-2.5 rounded-full mb-1.5'>
                                <Icon as={Clock} size='md' className='text-primary-600' />
                            </Box>
                            <Text size='2xs' className='text-typography-600 font-medium text-center'>Stay</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => { toggleExpand(); onLocate(); }} className='items-center w-16'>
                        <Box className='bg-background-100 p-2.5 rounded-full mb-1.5'>
                            <Icon as={MapPin} size='md' className='text-primary-600' />
                        </Box>
                        <Text size='2xs' className='text-typography-600 font-medium text-center'>Locate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { toggleExpand(); onDelete(); }} className='items-center w-16'>
                        <Box className='bg-error-50 p-2.5 rounded-full mb-1.5'>
                            <Icon as={Trash} size='md' className='text-error-600' />
                        </Box>
                        <Text size='2xs' className='text-error-600 font-medium text-center'>Remove</Text>
                    </TouchableOpacity>
                </HStack>
            )}
        </VStack>
    )
}

export default StopListItem