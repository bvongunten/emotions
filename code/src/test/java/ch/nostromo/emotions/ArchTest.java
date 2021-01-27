package ch.nostromo.emotions;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("ch.nostromo.emotions");

        noClasses()
            .that()
                .resideInAnyPackage("ch.nostromo.emotions.service..")
            .or()
                .resideInAnyPackage("ch.nostromo.emotions.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..ch.nostromo.emotions.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
