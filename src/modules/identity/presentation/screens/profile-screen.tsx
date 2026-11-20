import { Lock } from "lucide-react";
import type { CurrentUser } from "@/modules/identity/domain/current-user";
import { passwordAgeInDays } from "@/modules/identity/domain/password-age";
import { PasswordCard } from "@/modules/identity/presentation/components/password-card";
import { passwordAgeText, profileTexts } from "@/modules/identity/presentation/profile-texts";
import {
  Box,
  Breadcrumb,
  DescriptionList,
  Heading,
  Icon,
  ScrollArea,
  Stack,
  Text,
  TopBar,
} from "@/shared/presentation/ui";

export function ProfileScreen({
  user,
  passwordChangedAt,
}: {
  user: CurrentUser;
  passwordChangedAt: Date | null;
}) {
  const age = passwordChangedAt
    ? passwordAgeText(passwordAgeInDays(passwordChangedAt, new Date()))
    : profileTexts.noPassword;

  return (
    <>
      <TopBar start={<Breadcrumb items={profileTexts.breadcrumb} />} />
      <ScrollArea>
        <Box width="page" centered paddingY="5xl">
          <Stack gap="3xl">
            <Stack gap="xs">
              <Heading level={1} size="page">
                {profileTexts.title}
              </Heading>
              <Text size="md" tone="muted">
                {profileTexts.subtitle}
              </Text>
            </Stack>
            <Box surface="canvas" border="line-soft" radius="xl" shadow="card" clip>
              <DescriptionList
                layout="rows"
                items={[
                  { label: profileTexts.name, value: user.name },
                  {
                    label: profileTexts.email,
                    value: user.email,
                    aside: (
                      <Stack direction="row" align="center" gap="xs">
                        <Icon icon={Lock} size="xs" />
                        {profileTexts.managed}
                      </Stack>
                    ),
                  },
                ]}
              />
            </Box>
            <PasswordCard email={user.email} age={age} />
          </Stack>
        </Box>
      </ScrollArea>
    </>
  );
}
