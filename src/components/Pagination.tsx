import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  } from "@chakra-ui/icons"
  import {
    Box,
    Button,
    ButtonProps,
    Flex,
    FlexProps,
    IconButton,
    IconButtonProps,
  } from "@chakra-ui/react"
  
  const NavigationButton = (props: IconButtonProps) => {
    return <IconButton size="sm" borderRadius="full" {...props} />
  }
  
  const PageButton = (props: ButtonProps) => {
    return <Button variant="ghost" size="sm" {...props} />
  }
  
  type PaginationProps = {
    currentPage: number
    maxPage: number
    goPage: (page: number) => void
  } & FlexProps
  
  const Pagination = ({
    currentPage,
    maxPage,
    goPage,
    ...props
  }: PaginationProps) => {
    return (
      <Flex
        bgColor="white"
        p={2}
        borderRadius="lg"
        gap={2}
        px={4}
        align="center"
        {...props}
      >
        <NavigationButton
          icon={<ArrowLeftIcon fontSize={".8em"} />}
          aria-label="first"
          onClick={() => goPage(1)}
        />
        <NavigationButton
          icon={<ChevronLeftIcon fontSize={"1.5em"} />}
          aria-label="previous"
          onClick={() => goPage(currentPage - 1)}
        />
        <Box>Page</Box>
        {[-2, -1, 0, 1, 2]
          .filter((n) => n + currentPage <= maxPage)
          .filter((n) => n + currentPage > 0)
          .map((n) => (
            <PageButton
              key={n}
              bgColor={n === 0 ? "purple" : undefined}
              colorScheme={n === 0 ? "purple" : undefined}
              variant={n === 0 ? "solid" : "ghost"}
              onClick={() => goPage(currentPage + n)}
            >
              {currentPage + n}
            </PageButton>
          ))}
        {maxPage - currentPage > 4 && (
          <>
            <Box>...</Box>
            <PageButton>{maxPage}</PageButton>
          </>
        )}
        <NavigationButton
          icon={<ChevronRightIcon fontSize={"1.5em"} />}
          aria-label="next"
          onClick={() => goPage(currentPage + 1)}
        />
        <NavigationButton
          icon={<ArrowRightIcon fontSize={".8em"} />}
          aria-label="last"
          onClick={() => goPage(maxPage)}
        />
      </Flex>
    )
}
  
export default Pagination
  